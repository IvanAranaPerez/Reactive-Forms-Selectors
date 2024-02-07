import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/country.intefaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: ``
})
export class SelectorPageComponent implements OnInit {

  public countriesByRegion: SmallCountry[] = [];

  public borders: SmallCountry[] = [];

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],

  })

  constructor(
    private fb: FormBuilder,
    private countriesService: CountriesService,
  ) {}

  ngOnInit(): void {
    this.onRegionChange();
    this.onCoutryChanged();
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChange():void {
    this.myForm.get('region')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('country')!.setValue('') ),
      tap( () => this.borders = [] ),
      switchMap( (region) => this.countriesService.getCountriesByRegion(region)),
    )
    .subscribe( countries => {
      this.countriesByRegion = countries;
    });
  }

  onCoutryChanged(): void {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('border')!.setValue('') ),
      filter( (value: string) => value.length > 0  ),
      switchMap( (Cca3) => this.countriesService.getCountryByAlphaCode(Cca3) ),
      switchMap( (country) => this.countriesService.getCountriesByCodes(country.borders) )
    )
    .subscribe( countries => {
      // console.log({ borders: country.borders })
      this.borders = countries;
    });
  }

}
