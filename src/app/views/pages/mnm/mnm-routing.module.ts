import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path:'form',
		loadChildren: ()=>import('./mnm-form/mnm-form.module').then(m=>m.MnmFormModule)
	}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes),
  ],
	exports: [RouterModule]
})
export class MnmRoutingModule { }
