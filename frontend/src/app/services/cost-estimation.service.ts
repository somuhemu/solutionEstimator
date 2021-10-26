import { Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Questions, Result } from '../models/questions';
import { Sections } from '../models/sections';
// import questions from '../data/questions.json';
// import sections from '../data/sections.json';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class OptionClass {
  constructor(

    @Inject(String) public optionText: string,
  
    @Inject(Number) public maxDays: number,
    @Inject(Number) public maxPrice: number,
    @Inject(Number) public minDays: number,
    @Inject(Number) public minPrice: number,


  ) { }
}

export class QuestionClass {
  constructor(
    @Inject(String) public hashid: string,
    @Inject(Boolean) public multiple: boolean,
    @Inject(String) public question: string,
    public options: OptionClass[],
    @Inject(Number) public v: number,
    @Inject(String) public qid: number,
    @Inject(String) public idd: string
  ) {
  }
}

export class SectionClass {
  constructor(
    @Inject(String) public id: string,
    @Inject(Number) public sectionId: number,
    @Inject(String) public sectionName: string,
    @Inject(String) public sectionDescription: string,
    @Inject(String) public publishedAt: string,
    public questionIds: QuestionClass[],
    @Inject(String) public createdAt: string,
    @Inject(String) public updatedAt: string,
    @Inject(Number) public v: number,
    @Inject(String) public idd: string
  ) { }
}

@Injectable()

export class CostEstimationService {
  currentQuestionId: number = 0;
  currentSectionIndex: number = 0;
  answers: Questions[] = [];
  // questions: Questions[] = questions;
  // sections: Sections[] = sections;
  questions: any[] = [];
  sections: Sections[] = [];
  maxPrice: number = 0;
  minPrice: number = 0;
  maxDays: number = 0;
  minDays: number = 0;
  overAllAnswers: Questions[] = [];

  sectionData: SectionClass[] = [];

  constructor(private http: HttpClient) { }

  getData() {
    return new Promise<SectionClass[]>((resolve, reject) => {
      let url = 'http://localhost:1337/sections';
      this.http.get<any>(url).subscribe(response => {
        // this.sectionData = response;

        resolve(response);
      });
    }
    )
  }
  fetchSectionsAndQuestions() {
    for (let i = 0; i < this.sectionData.length; i++) {
      var secObj: Sections = {
        sectionId: this.sectionData[i].sectionId,
        sectionName: this.sectionData[i].sectionName,
        questionId: [],
        sectionDescription: this.sectionData[i].sectionDescription
      }
      for (let j = 0; j < this.sectionData[i].questionIds.length; j++) {
        secObj.questionId.push(this.sectionData[i].questionIds[j].qid);
        this.questions.push(this.sectionData[i].questionIds[j])
      }
      this.sections.push(secObj);
    }
  }

  setInitialValues = async () => {
    this.sectionData = await this.getData();
    this.fetchSectionsAndQuestions();
    if (this.sectionData) {
      this.currentSectionIndex = 0;
      this.currentQuestionId = this.getSectionByIndex(
        this.currentSectionIndex
      ).questionId[0];
      this.answers = this.questions.map((question: QuestionClass) => {
        return { qid: question.qid, multiple: question.multiple, question: question.question, options: [] }
      });
    }
  }
  getSections() {
    return this.sections;
  }

  getSectionByIndex(index: number) {
    // console.log(index)
    // console.log(this.sections[index]);
    return this.sections[index];
  }

  getCurrentQuestionId(): number {
    return this.currentQuestionId;
  }

  getCurrentQuestion(): Questions {
    //if qid matches with current question id, then return that question
    const currentQuestion = this.questions.find((question: Questions) => {
      return question.qid == this.currentQuestionId;
    })
    return currentQuestion;
  }

  setAnswerById(id: number, options: any) {
    //map through the answers array
    this.answers = this.answers.map((answer) => {
      //check if qid matches with the id passesed as parameter
      if (answer.qid == id) {
        //set options in the answer array to option passed in the parameter
        answer.options = options;

        for (var i = 0; i < answer.options.length; i++) {
          this.maxPrice += answer.options[i].maxPrice;
          this.minPrice += answer.options[i].minPrice
          this.maxDays += answer.options[i].maxDays;
          this.minDays += answer.options[i].minDays;
        }
      }
      return answer;
    })
  }

  getQuestionById(id: number) {
    const currentQuestion = this.questions.find((question: Questions) => {
      return question.qid == id;
    })
    return currentQuestion;
  }

  getNextQuestion(): Questions {
    //check if this is the last question of current section
    if (this.isLastQuestionOfCurrentSection(this.currentQuestionId)) {
      //increment current section as we need next section
      this.currentSectionIndex += 1;
      //set current question id to first index of next section
      this.currentQuestionId = this.getSectionByIndex(
        this.currentSectionIndex
      ).questionId[0];

    } else {
      //check the next question id in the current section and set it to question id
      const sectionQuestions = this.getSectionByIndex(this.currentSectionIndex).questionId;
      this.currentQuestionId = sectionQuestions[sectionQuestions.indexOf(this.currentQuestionId) + 1];

    }

    return this.getQuestionById(this.currentQuestionId);
  }

  getPreviousQuestion(): Questions {
    const sectionQuestions = this.getSectionByIndex(this.currentSectionIndex).questionId;
    this.currentQuestionId = sectionQuestions[sectionQuestions.indexOf(this.currentQuestionId) - 1];
    console.log("from service", this.currentQuestionId);
    return this.getQuestionById(this.currentQuestionId);
  }

  isLastQuestionOfCurrentSection(id: number) {
    // compare index of current question and current sections questions array length
    const sectionQuestions = this.getSectionByIndex(
      this.currentSectionIndex
    ).questionId;

    var indexOfCurrentQuestion = sectionQuestions.indexOf(
      this.currentQuestionId
    );//
    if (indexOfCurrentQuestion == sectionQuestions.length - 1) {
      return true;
    } else {
      return false;
    }

  }

  getAnswersOfCurrentSectionByIndex(index: number): Questions[] {
    let sectionAnswers: Questions[] = [];
    //check against the all question ids present in the current section
    const sectionQuestionList = this.getSectionByIndex(index).questionId; //0 [1, 2]
    for (var i = 0; i < this.answers.length; i++) {
      console.log(sectionQuestionList.indexOf(this.answers[i].qid));
      if (sectionQuestionList.indexOf(this.answers[i].qid) >= 0) {

        sectionAnswers.push(this.answers[i]);
      }
    }
    this.overAllAnswers.push(...sectionAnswers);// for summary
    return sectionAnswers;
  }

  incrementCurrentSection() {
    this.currentSectionIndex += 1;
  }

  skipSection() {
    this.currentSectionIndex += 1;
    this.currentQuestionId = this.getSectionByIndex(
      this.currentSectionIndex
    ).questionId[0];
  }

  goToSection(id: number) {
    this.currentSectionIndex = (id);
    this.currentQuestionId = this.getSectionByIndex(
      this.currentSectionIndex
    ).questionId[0];

  }

  getAnswerByQuestionId(id: number) {
    const currentAnswers: Questions[] = this.answers.filter((x) => x.qid == id);
    return currentAnswers[0].options;
  }

}
