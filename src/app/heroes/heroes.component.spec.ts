import { Component, DebugElement, Directive, Input, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroComponent } from "../hero/hero.component";
import { HeroesComponent } from "./heroes.component";

@Directive({
  selector: "[routerLink]",
  host: { "(click)": "onClick()" },
})
export class RouterLinkDirectiveStub {
  @Input("routerLink") linkParams: any;

  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe("HeroesComponent", () => {
  let component: HeroesComponent;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: "Spider Man", strength: 5 },
      { id: 2, name: "Batman", strength: 11 },
      { id: 3, name: "Iron Man", strength: 22 },
    ];

    mockHeroService = jasmine.createSpyObj([
      "getHeroes",
      "addHero",
      "deleteHero",
    ]);
    component = new HeroesComponent(mockHeroService);
  });

  describe("delete", () => {
    it("should remove the indicated hero from the heroes list", () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(component.heroes.length).toEqual(2);
    });

    it("should call deleteHero", () => {
      mockHeroService.deleteHero.and.returnValue(of(true));
      component.heroes = HEROES;

      component.delete(HEROES[2]);

      expect(mockHeroService.deleteHero).toHaveBeenCalled();
    });
  });
});

describe("HeroesComponent (Shallow tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  @Component({
    selector: "app-hero",
    template: "<span>HeroComponent</span>",
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
  }

  beforeEach(() => {
    HEROES = [
      { id: 1, name: "Spider Man", strength: 5 },
      { id: 2, name: "Batman", strength: 11 },
      { id: 3, name: "Iron Man", strength: 22 },
    ];

    mockHeroService = jasmine.createSpyObj([
      "getHeroes",
      "addHero",
      "deleteHero",
    ]);

    TestBed.configureTestingModule({
      declarations: [FakeHeroComponent, HeroesComponent],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService,
        },
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(HeroesComponent);
  });

  it("should set heroes correctly from the service", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    expect(fixture.componentInstance.heroes.length).toEqual(3);
  });

  it("should create one <li> for each hero", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    expect(fixture.debugElement.queryAll(By.css("li")).length).toEqual(3);
  });
});

describe("HeroesComponent (Deep tests)", () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  beforeEach(() => {
    HEROES = [
      { id: 1, name: "Spider Man", strength: 5 },
      { id: 2, name: "Batman", strength: 11 },
      { id: 3, name: "Iron Man", strength: 22 },
    ];

    mockHeroService = jasmine.createSpyObj([
      "getHeroes",
      "addHero",
      "deleteHero",
    ]);

    TestBed.configureTestingModule({
      declarations: [HeroComponent, HeroesComponent, RouterLinkDirectiveStub],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService,
        },
      ],
      // schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HeroesComponent);
  });

  it("should render each hero as a HeroComponent", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));

    fixture.detectChanges();

    const heroComponentsDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    expect(heroComponentsDEs.length).toEqual(3);

    heroComponentsDEs.forEach((de, index) => {
      const componentInstance = de.componentInstance;
      expect(componentInstance.hero.name).toEqual(HEROES[index].name);
    });
  });

  it(`should call heroService.deleteHero when the Hero Component's delete button is clicked`, () => {
    spyOn(fixture.componentInstance, "delete");
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    mockHeroService.deleteHero.and.returnValue(of(true));

    fixture.detectChanges();

    const heroComponentsDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    (<HeroComponent>heroComponentsDEs[0].componentInstance).delete.emit(
      undefined
    );

    expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
  });

  it("should add a new hero to the hero list when the add button is clicked", () => {
    const name = "Mr. Increible";
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    mockHeroService.addHero.and.returnValue(of({ id: 5, name, stength: 24 }));

    const inputElement = fixture.debugElement.query(
      By.css("input")
    ).nativeElement;
    inputElement.value = name;
    const addButton = fixture.debugElement.queryAll(By.css("button"))[0];
    addButton.triggerEventHandler("click", null);
    fixture.detectChanges();

    const heroComponentsDEs = fixture.debugElement.queryAll(
      By.directive(HeroComponent)
    );
    const heroComponent = <HeroComponent>(
      heroComponentsDEs[heroComponentsDEs.length - 1].componentInstance
    );
    expect(heroComponent.hero.id).toEqual(5);
    expect(heroComponent.hero.name).toEqual(name);
  });

  it("should have the correct route for the first hero", () => {
    mockHeroService.getHeroes.and.returnValue(of(HEROES));
    fixture.detectChanges();
    
    const heroComponentsDEs = (<DebugElement[]>fixture.debugElement.queryAll(By.directive(HeroComponent)));
    const routerLink =heroComponentsDEs[0].query(By.directive(RouterLinkDirectiveStub)).injector.get(RouterLinkDirectiveStub);

    heroComponentsDEs[0].query(By.css('a')).triggerEventHandler('click', null);

    expect(routerLink.navigatedTo).toContain('/detail/1')
  });
});
