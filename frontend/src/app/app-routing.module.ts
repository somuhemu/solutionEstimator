import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OverviewComponent } from './overview/overview.component';
import { QuestionsComponent } from './questions/questions.component';
import { ResultsComponent } from './results/results.component';
const routes: Routes = [

  { path: '', component:HomeComponent},
  { path: 'questions', component: QuestionsComponent },
  {path:'overview/:index', component:OverviewComponent},
  { path: 'results', component:ResultsComponent },
  { path: '**', component:HomeComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [HomeComponent,QuestionsComponent, 
  OverviewComponent,ResultsComponent]
