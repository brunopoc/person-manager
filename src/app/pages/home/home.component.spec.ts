import {
  ComponentFixture,
  TestBed,
} from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { HomeComponent } from "./home.component";
import { PessoasService } from "../../services/pessoas.service";
import { NotificationService } from "../../services/notification.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { of, throwError } from "rxjs";
import { Pessoa } from "../../models/pessoa.model";

describe("HomeComponent", () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  let mockPessoasService: jest.Mocked<PessoasService>;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockModalService: jest.Mocked<NgbModal>;

  const pessoaMock: Pessoa = { id: 1, nome: "João" } as Pessoa;

  beforeEach(async () => {

    mockPessoasService = {
      getPessoas: jest.fn(),
      updatePessoa: jest.fn(),
      deletePessoa: jest.fn(),
    } as unknown as jest.Mocked<PessoasService>;

    mockNotificationService = {
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showInfo: jest.fn(),
    } as unknown as jest.Mocked<NotificationService>;

    mockModalService = {
      open: jest.fn(),
    } as unknown as jest.Mocked<NgbModal>;

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } },
        },
        { provide: PessoasService, useValue: mockPessoasService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: NgbModal, useValue: mockModalService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    mockPessoasService.getPessoas.mockReturnValue(of([]));
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should load pessoas on init", () => {
    const pessoas = [pessoaMock];
    mockPessoasService.getPessoas.mockReturnValue(of(pessoas));

    component.ngOnInit();

    expect(mockPessoasService.getPessoas).toHaveBeenCalled();
    expect(component.pessoas).toEqual(pessoas);
    expect(component.isLoading).toBe(false);
  });

  it("should show error notification if loadPessoas fails", () => {
    mockPessoasService.getPessoas.mockReturnValue(
      throwError(() => new Error("Erro"))
    );

    component.ngOnInit();

    expect(mockPessoasService.getPessoas).toHaveBeenCalled();
    expect(component.isLoading).toBe(false);
    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      "Erro ao carregar pessoas."
    );
  });

  it("should update pessoa on submit", () => {
    const updated: Pessoa = {
      id: 1,
      nome: "João Silva",
      cpf: "11144477735",
      sexo: "M",
      email: "joao@email.com",
      telefone: "11987654321",
    };
    const pessoas = [pessoaMock];
    component.pessoas = [...pessoas];

    mockPessoasService.updatePessoa.mockReturnValue(of(updated));

    component.onSubmitEdit(updated);

    expect(component.isLoading).toBe(false);
    expect(mockNotificationService.showSuccess).toHaveBeenCalledWith(
      "Pessoa atualizada com sucesso!"
    );
    expect(component.pessoas[0].nome).toBe("João Silva");
  });

  it("should show error on update failure", () => {
    mockPessoasService.updatePessoa.mockReturnValue(
      throwError(() => new Error("Erro"))
    );
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    component.onSubmitEdit(pessoaMock);

    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      "Erro ao atualizar pessoa."
    );
    expect(component.isLoading).toBe(false);

    spy.mockRestore();
  });

  it("should not delete pessoa if not confirmed", () => {
    window.confirm = jest.fn(() => false);

    component.deletePessoa(pessoaMock);

    expect(mockPessoasService.deletePessoa).not.toHaveBeenCalled();
  });

  it("should show error on delete failure", () => {
    window.confirm = jest.fn(() => true);
    component.pessoas = [pessoaMock];
    mockPessoasService.deletePessoa.mockReturnValue(
      throwError(() => new Error("Erro"))
    );

    const spy = jest.spyOn(console, "error").mockImplementation(() => {});

    component.deletePessoa(pessoaMock);

    expect(mockNotificationService.showError).toHaveBeenCalledWith(
      "Erro ao remover pessoa. Tente novamente."
    );
    expect(component.pessoas.length).toBe(1);

    spy.mockRestore();
  });

  it("should clean up subscriptions on destroy", () => {
    const completeSpy = jest.spyOn<any, any>(component["destroy$"], "complete");
    const nextSpy = jest.spyOn<any, any>(component["destroy$"], "next");

    component.ngOnDestroy();

    expect(nextSpy).toHaveBeenCalled();
    expect(completeSpy).toHaveBeenCalled();
  });
});
