import {
  Component,
  EventEmitter,
  Input,
  Output
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { of } from "rxjs";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component";

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

describe("HeroesComponent Shallow", () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService;
  let HEROES;

  @Component({
    selector: "app-hero",
    template: "<span>HeroComponent</span>",
  })
  class FakeHeroComponent {
    @Input() hero: Hero;
    @Output() delete = new EventEmitter();
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
