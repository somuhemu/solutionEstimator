import { Component, OnInit } from '@angular/core';
import { Sections } from '../models/sections';
import { Questions, Result } from '../models/questions';
import { CostEstimationService } from '../services/cost-estimation.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnInit {
  presentQuestion!: Questions;
  answer: Result[] = [];
  //for showing section names and progress bar
  currentQuestion: number = 1;
  sectionNumber: number = 1;
  public sections: Sections[] = [];

  sectionStarted: boolean = false;

  skipParticularSection:number = 0; 
  skipSectionValues:Sections[]= [];

  showSkip:boolean = true;

  constructor(
    private _costEstimationService: CostEstimationService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.sections = this._costEstimationService.getSections();
    this.sectionNumber = this._costEstimationService.currentSectionIndex;
    // console.log(
    //   'current section Index is ',
    //   this._costEstimationService.currentSectionIndex
    // );
    this.skipSectionValues = this.sections;
    // this.answer = this._costEstimationService.getAnswerByQuestionId(this.presentQuestion.qid);
    
    
  }
  toggleSelection(chip:MatChip, option:Result) {
    chip.toggleSelected();
    if(this.answer.length>0){
      this.answer[0].selected = false;
    }
    option.selected = true;
    this.answer[0] = option;
    
 }

 multipleToggleSelection(option:Result){
  const isExists = this.answer.findIndex(x=>x.optionText == option.optionText)
  if(isExists > -1){
    this.answer[isExists].selected = false;
    this.answer != this.answer.splice(isExists,1);
  }else{
    option.selected = true;
    this.answer.push(option);
  }
 }

 showanswer(){
  console.log("answer is ",this._costEstimationService.getAnswerByQuestionId(this.presentQuestion.qid));
 }

 click(){
  console.log(this.answer);
 }



  skipSecionHandler(id:any){
    // this.showSkip =  false;
    this._costEstimationService.goToSection(id);
    this.sectionNumber = id;
    this.currentQuestion =1;
    
    //on clicking any button we fetch question
    // this.sectionStarted = true;
    this.presentQuestion = this._costEstimationService.getCurrentQuestion();
    this.answer = this._costEstimationService.getAnswerByQuestionId(this.presentQuestion.qid);
    console.log(this.answer.length);
    console.log("Current question Id is :",this.presentQuestion.qid);
  }

  //store the option selected into answer
  radioChangeHandler(option: Result): void {
    this.answer = [option];
  }

  continue(): void {
    this.presentQuestion = this._costEstimationService.getCurrentQuestion();
    this.sectionStarted = true;
    console.log("Current question Id is :",this.presentQuestion.qid);

  }
  skipSection(): void {
    if (this.sectionNumber < this._costEstimationService.sections.length - 1) {
      this.sectionNumber++;
      this._costEstimationService.skipSection();
    } else {
      this.route.navigate(['/results']);
    }
  }

  toOverview(): void {
    this.route.navigate([
      '/overview/' + (this._costEstimationService.currentSectionIndex - 1),
    ]);
    this.sectionNumber++;
  }

  next(): void {
    //check whether option is selected
    
    if (this.answer.length == 0 ) {
      Swal.fire('Oops...', 'Please select an option!', 'error');
    }
     else {
      this.currentQuestion++; // used to show question number
      //set current question answer before calling next question
      this._costEstimationService.setAnswerById(
        this.presentQuestion.qid,
        this.answer
      );
      //check if current question is last question of current section
      if (
        this._costEstimationService.isLastQuestionOfCurrentSection(
          this.presentQuestion.qid
        )
      ) {
        //check if last section
        if (
          this._costEstimationService.currentSectionIndex ==
          this._costEstimationService.sections.length - 1
        ) {
          //if yes, increment current section and call overview
          this._costEstimationService.incrementCurrentSection();
          this.toOverview();
        }
        //get next question and move to overpage
        else {
          // 1 2 3
          this._costEstimationService.getNextQuestion();
         // this.answer = this._costEstimationService.getAnswerByQuestionId(this.presentQuestion.qid);
         // console.log(this.answer)  redundent any how we push that answer option to answers in cost estimate som
          this.toOverview();
        }
      }
      //if not last question, call next question
      else {
        this.answer = [];
        this.presentQuestion = this._costEstimationService.getNextQuestion();
        this.answer = this._costEstimationService.getAnswerByQuestionId(this.presentQuestion.qid);
        console.log(this.answer)//empty first som
      }
    }
    console.log("Current question Id is :",this.presentQuestion.qid);
  }

  previous(){
    // console.log("Previous Clicked, question Id is",this.presentQuestion.qid)
    this.currentQuestion--;
    // this._costEstimationService.getPreviousQuestion();
    this.presentQuestion = this._costEstimationService.getPreviousQuestion();
    this.answer = this._costEstimationService.getAnswerByQuestionId(this.presentQuestion.qid);
    console.log("answer from prev",this.answer)
  }

  toResults(): void {
    this.route.navigate(['/results']);
  }
}


