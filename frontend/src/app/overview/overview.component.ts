import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CostEstimationService } from '../services/cost-estimation.service';
import { ActivatedRoute } from '@angular/router';
import { Questions } from '../models/questions';
import { Sections } from '../models/sections';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  sectionRoute: string | null = '';
  sectionIndex: number = 0;
  answers: Questions[] = [];
  public sections: Sections[] = [];
  details: boolean = false;
  basket: boolean = false;
  isLastSection: boolean = false;

  minPrice: number = 0;
  maxPrice: number = 0;
  minDays: number = 0;
  maxDays: number = 0;

  sectionExist: boolean = true;

  constructor(
    private _costEstimationService: CostEstimationService,
    private route: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.activatedRoute.snapshot.paramMap.get('index')) {
      this.sectionRoute = this.activatedRoute.snapshot.paramMap.get('index');
      this.sectionIndex = this.sectionRoute ? parseInt(this.sectionRoute) : 0;

      this.sections = this._costEstimationService.getSections();

      this.maxPrice = this._costEstimationService.maxPrice;
      this.minPrice = this._costEstimationService.minPrice;
      this.maxDays = this._costEstimationService.maxDays;
      this.minDays = this._costEstimationService.minDays;
      console.log("Answers are :",this.answers);

      if (
        this.sectionIndex ==
        this._costEstimationService.sections.length - 1
      ) {
        this.isLastSection = true;
      }

      if (
        this.sectionIndex <=
        this._costEstimationService.sections.length - 1
      ) {
        this.answers =
          this._costEstimationService.getAnswersOfCurrentSectionByIndex(
            this.sectionIndex
          );
      } else {
        this.sectionExist = false;
      }
    }
  }

  //for detailed answer
  toggle(): void {
    this.details = !this.details;
  }

  showBasket(): void {
    this.basket = !this.basket;
  }

  toQuestions(): void {
    if(!this.isLastSection)
    {
      console.log("toquestions som")
      this.route.navigate(['/questions']);
    }
    else
    {
      console.log("just check somm");
      this.route.navigate(['/results']);
    }

  }
  toresults(): void {
    console.log("is it there");
    this.route.navigate(['/results']);
  }
}
