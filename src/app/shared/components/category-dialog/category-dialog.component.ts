import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent {
  newCategoryName: string = '';
  selectedCategory: any;
  categories: any[];
  filteredCategories: any[];
  searchText: string = '';

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.categories = data.categories || [];
    this.filteredCategories = [...this.categories]; // Initialize with all categories
  }

  
/** Select a category and highlight it */
  selectCategory(category: any) {
    this.selectedCategory = category;
    this.dialogRef.close({ categoryId: category.id, categoryName: category.name });
  }


  // addCategory() {
  //   if (this.newCategoryName.trim()) {
  //     this.dialogRef.close({ categoryName: this.newCategoryName });
  //   }
  // }

 // Add New Category & Update List Instantly
 addCategory() {
  if (this.newCategoryName.trim()) {
    const newCategory = {
      id: this.categories.length + 1, // Temporary ID (can be replaced after saving to backend)
      name: this.newCategoryName
    };

    this.categories.push(newCategory); // Add to main category list
    this.filteredCategories.push(newCategory); // Also update filtered list
    this.newCategoryName = ''; // Clear input field

    // Optionally, send this new category to backend
    // this.categoryService.addCategory(newCategory).subscribe(() => console.log('Category added!'));

    // Close the dialog and return the new category
    this.dialogRef.close({ categoryName: newCategory.name });
  }
}





  // Search Category
  filterCategories() {
    if (!this.searchText) {
      this.filteredCategories = [...this.categories];
    } else {
      this.filteredCategories = this.categories.filter(category =>
        category.name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }
}