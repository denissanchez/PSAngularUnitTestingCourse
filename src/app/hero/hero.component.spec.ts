import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroComponent } from "./hero.component";
import { By } from "@angular/platform-browser";

describe("HeroComponent (shallow tests)", () => {
  let fixture: ComponentFixture<HeroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeroComponent],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(HeroComponent);
  });

  it("should have the correct hero", () => {
    fixture.componentInstance.hero = {
      id: 1,
      name: "Super Man",
      strength: 3,
    };

    expect(fixture.componentInstance.hero.name).toEqual("Super Man");
  });

  it("should render the hero name in an anchor tag", () => {
    fixture.componentInstance.hero = {
      id: 1,
      name: "Iron Man",
      strength: 15,
    };
    
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('a')).nativeElement.textContent).toContain('Iron Man')
    // expect(fixture.nativeElement.querySelector('a').textContent).toContain('Iron Man')
  });
});
