import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { PessoaEditModalComponent } from "./pessoa-edit-modal.component";
import { Pessoa } from "../../models/pessoa.model";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";

jest.mock("../../utils/validators/cpf.validator", () => ({
  cpfValidator: () => Validators.required,
}));
jest.mock("../../utils/validators/email.validator", () => ({
  emailValidator: () => Validators.required,
}));

describe("PessoaEditModalComponent", () => {
  let component: PessoaEditModalComponent;
  let fixture: ComponentFixture<PessoaEditModalComponent>;
  let mockActiveModal: jest.Mocked<NgbActiveModal>;

  const mockPessoa: Pessoa = {
    id: 1,
    nome: "João Silva",
    cpf: "12345678901",
    sexo: "M",
    email: "joao@email.com",
    telefone: "11999999999",
  };

  beforeEach(async () => {
    mockActiveModal = {
      close: jest.fn(),
      dismiss: jest.fn(),
    } as unknown as jest.Mocked<NgbActiveModal>;

    await TestBed.configureTestingModule({
      imports: [CommonModule, ReactiveFormsModule, PessoaEditModalComponent],
      providers: [
        FormBuilder,
        { provide: NgbActiveModal, useValue: mockActiveModal },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PessoaEditModalComponent);
    component = fixture.componentInstance;
    component.pessoa = { ...mockPessoa };
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with pessoa data", () => {
    expect(component.editForm.get("nome")?.value).toBe("João Silva");
    expect(component.editForm.get("cpf")?.value).toBe("123.456.789-01");
    expect(component.editForm.get("sexo")?.value).toBe("M");
    expect(component.editForm.get("email")?.value).toBe("joao@email.com");
    expect(component.editForm.get("telefone")?.value).toBe("11999999999");
  });

  it("should dismiss modal if pessoa is not provided on ngOnInit", () => {
    const newFixture = TestBed.createComponent(PessoaEditModalComponent);
    const newComponent = newFixture.componentInstance;

    newComponent.ngOnInit();

    expect(mockActiveModal.dismiss).toHaveBeenCalledWith("no pessoa data");
  });

  it("should have required validators", () => {
    const form = component.editForm;

    form.patchValue({
      nome: "",
      cpf: "",
      sexo: "",
      email: "",
      telefone: "",
    });

    expect(form.get("nome")?.hasError("required")).toBeTruthy();
    expect(form.get("cpf")?.hasError("required")).toBeTruthy();
    expect(form.get("sexo")?.hasError("required")).toBeTruthy();
    expect(form.get("email")?.hasError("required")).toBeTruthy();
    expect(form.get("telefone")?.hasError("required")).toBeTruthy();
  });

  it("should validate nome minlength", () => {
    const nomeControl = component.editForm.get("nome");

    nomeControl?.setValue("J");
    expect(nomeControl?.hasError("minlength")).toBeTruthy();

    nomeControl?.setValue("João Silva");
    expect(nomeControl?.valid).toBeTruthy();
  });

  it("should validate CPF correctly (using mocked validator)", () => {
    const cpfControl = component.editForm.get("cpf");

    cpfControl?.setValue("123.456.789-01");
    expect(cpfControl?.valid).toBeTruthy();

    cpfControl?.setValue("invalid");
    expect(cpfControl?.valid).toBeTruthy();
  });

  it("should validate email correctly (using mocked validator)", () => {
    const emailControl = component.editForm.get("email");

    emailControl?.setValue("test@email.com");
    expect(emailControl?.valid).toBeTruthy();

    emailControl?.setValue("invalid-email");
    expect(emailControl?.valid).toBeTruthy();
  });

  it("should validate telefone minlength", () => {
    const telefoneControl = component.editForm.get("telefone");

    telefoneControl?.setValue("123");
    expect(telefoneControl?.hasError("minlength")).toBeTruthy();

    telefoneControl?.setValue("11999999999");
    expect(telefoneControl?.valid).toBeTruthy();
  });

  it("should call activeModal.close with updated pessoa when form is valid", () => {
    const updatedName = "João Silva Updated";
    const updatedCpf = "111.444.777-35";
    const updatedEmail = "joao.updated@email.com";
    const updatedTelefone = "(11) 99999-9999";

    component.editForm.patchValue({
      nome: updatedName,
      cpf: updatedCpf,
      sexo: "F",
      email: updatedEmail,
      telefone: updatedTelefone,
    });

    component.onSubmit();

    expect(mockActiveModal.close).toHaveBeenCalledWith({
      ...mockPessoa,
      nome: updatedName,
      cpf: "11144477735",
      sexo: "F",
      email: updatedEmail,
      telefone: "11999999999",
    });
  });

  it("should not call activeModal.close when form is invalid", () => {
    component.editForm.patchValue({
      nome: "",
    });

    component.onSubmit();

    expect(mockActiveModal.close).not.toHaveBeenCalled();
  });

  it("should call activeModal.dismiss when onCancel is called", () => {
    component.onCancel();
    expect(mockActiveModal.dismiss).toHaveBeenCalledWith("cancel");
  });

  it("should format CPF input correctly", () => {
    const mockEvent = {
      target: { value: "12345678901" },
    } as unknown as Event;

    component.onCpfInput(mockEvent);
    expect(component.editForm.get("cpf")?.value).toBe("123.456.789-01");
  });

  it("should format telefone input correctly for 11 digits", () => {
    const mockEvent = {
      target: { value: "11999999999" },
    } as unknown as Event;

    component.onTelefoneInput(mockEvent);
    expect(component.editForm.get("telefone")?.value).toBe("(11) 99999-9999");
  });

  it("should format telefone input correctly for 10 digits", () => {
    const mockEvent = {
      target: { value: "1199999999" },
    } as unknown as Event;

    component.onTelefoneInput(mockEvent);
    expect(component.editForm.get("telefone")?.value).toBe("(11) 9999-9999");
  });

  it("should get correct error messages for required fields", () => {
    const form = component.editForm;
    form.patchValue({
      nome: "",
      cpf: "",
      sexo: "",
      email: "",
      telefone: "",
    });
    form.markAllAsTouched();

    expect(component.getErrorMessage("nome")).toBe("Nome é obrigatório");
    expect(component.getErrorMessage("cpf")).toBe("CPF é obrigatório");
    expect(component.getErrorMessage("sexo")).toBe("Sexo é obrigatório");
    expect(component.getErrorMessage("email")).toBe("Email é obrigatório");
    expect(component.getErrorMessage("telefone")).toBe(
      "Telefone é obrigatório"
    );
  });

  it("should get correct error messages for minlength", () => {
    const form = component.editForm;
    form.patchValue({
      nome: "J",
      telefone: "123",
    });
    form.markAllAsTouched();

    expect(component.getErrorMessage("nome")).toBe(
      "Nome deve ter pelo menos 2 caracteres"
    );
    expect(component.getErrorMessage("telefone")).toBe(
      "Telefone deve ter pelo menos 10 dígitos"
    );
  });

  it("should get correct error messages for custom validators (CPF/Email)", () => {
    const form = component.editForm;
    form.markAllAsTouched();

    form.get("cpf")?.setErrors({ cpfInvalid: true });
    expect(component.getErrorMessage("cpf")).toBe("CPF inválido");

    form.get("email")?.setErrors({ emailInvalid: true });
    expect(component.getErrorMessage("email")).toBe("Email inválido");
  });

  it("should display loading state when isSubmitting is true", () => {
    component.isSubmitting = true;
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    const submitButton = compiled.querySelector('button[type="submit"]');
    expect(submitButton?.hasAttribute("disabled")).toBeTruthy();
    expect(compiled.textContent).toContain("Salvando...");
  });

  it("should display save button text when isSubmitting is false", () => {
    component.isSubmitting = false;
    fixture.detectChanges();

    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.textContent).toContain("Salvar Alterações");
  });
});