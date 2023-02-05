import { Location } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component";

describe("HeroDetailComponent", () => {
  let fixture: ComponentFixture<HeroDetailComponent>;
  let mockHeroService, mockActivatedRoute, mockLocation;

  beforeEach(() => {
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => "3" } },
    };
    mockHeroService = jasmine.createSpyObj(["getHero", "updateHero"]);
    mockLocation = jasmine.createSpyObj(["back"]);

    TestBed.configureTestingModule({
      declarations: [HeroDetailComponent],
      imports: [FormsModule],
      providers: [
        { provide: HeroService, useValue: mockHeroService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Location, useValue: mockLocation },
      ],
    });

    fixture = TestBed.createComponent(HeroDetailComponent);

    mockHeroService.getHero.and.returnValue(
      of({ id: 3, name: "IronMan", strength: 100 })
    );
  });

  it("should render hero name in a h2 tag", () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector("h2").textContent).toContain("IRONMAN");
  });
});
