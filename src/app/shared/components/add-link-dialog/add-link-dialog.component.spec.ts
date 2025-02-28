import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLinkDialogComponent } from './add-link-dialog.component';

describe('AddLinkDialogComponent', () => {
  let component: AddLinkDialogComponent;
  let fixture: ComponentFixture<AddLinkDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddLinkDialogComponent]
    });
    fixture = TestBed.createComponent(AddLinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
