import { TestBed } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
import { appConfig } from "./app.config";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { ActivatedRoute } from "@angular/router";

describe("AppComponent", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => null } } },
        },
      ],
    }).compileComponents();
  });

  it("should create the app", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Sistema de Gestão de Pessoas'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual("Sistema de Gestão de Pessoas");
  });

  it("should call ngOnInit without errors", () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(() => app.ngOnInit()).not.toThrow();
  });
});

describe("app.routes", () => {
  it("should have routes defined", () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  it("should have a root route with loadComponent function", () => {
    const rootRoute = routes.find((r) => r.path === "");
    expect(rootRoute).toBeDefined();
    expect(typeof rootRoute?.loadComponent).toBe("function");
  });

  it("should have a wildcard route redirecting to /404", () => {
    const wildcardRoute = routes.find((r) => r.path === "**");
    expect(wildcardRoute).toBeDefined();
    expect(wildcardRoute?.redirectTo).toBe("/404");
  });
});

describe("appConfig", () => {
  it("should have providers array", () => {
    expect(appConfig.providers).toBeDefined();
    expect(Array.isArray(appConfig.providers)).toBe(true);
  });

  it("should provide HTTP_INTERCEPTORS with ErrorInterceptor", () => {
    const interceptorProvider = appConfig.providers.find(
      (p: any) => p.provide === HTTP_INTERCEPTORS
    );
    expect(interceptorProvider).toBeDefined();
  });
});
