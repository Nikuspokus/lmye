import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product, Category, ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Observable, tap, shareReplay } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>Tableau de Bord Admin</h1>
        <button (click)="logout()" class="btn btn-logout">DÉCONNEXION</button>
      </header>

      <div class="dashboard-grid">
        <!-- Formulaire et Gestion -->
        <div class="form-scroll-container">
          <!-- Gestion des Catégories -->
          <div class="form-section mb-4 category-section" [class.collapsed]="isCategoryCollapsed">
            <div class="section-header" tabindex="0" (click)="isCategoryCollapsed = !isCategoryCollapsed" (keydown.enter)="isCategoryCollapsed = !isCategoryCollapsed">
              <h2>Gestion des Catégories</h2>
              <button class="chevron-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <path [attr.d]="isCategoryCollapsed ? 'M19 9l-7 7-7-7' : 'M5 15l7-7 7 7'" />
                </svg>
              </button>
            </div>

            @if (!isCategoryCollapsed) {
              <div class="collapsible-content">
                <form [formGroup]="categoryForm" (ngSubmit)="onAddCategory()" class="category-form">
                  <div class="form-group">
                    <label for="cat-name">Nom de la catégorie</label>
                    <input id="cat-name" formControlName="name" placeholder="Ex: Décoration, Bijoux...">
                  </div>
                  <div class="form-group">
                    <label for="cat-color">Couleur du badge</label>
                    <div class="color-picker-wrapper">
                      <input id="cat-color" type="color" formControlName="color">
                      <span>{{ categoryForm.get('color')?.value }}</span>
                    </div>
                  </div>
                  <div class="form-actions">
                    <button type="submit" class="btn btn-secondary btn-small" [disabled]="categoryForm.invalid || isCategoryLoading">
                      {{ isCategoryLoading ? 'EN COURS...' : (editingCategoryId ? 'METTRE À JOUR' : 'AJOUTER LA CATÉGORIE') }}
                    </button>
                    @if (editingCategoryId) {
                      <button type="button" (click)="cancelCategoryEdit()" class="btn btn-secondary btn-small">ANNULER</button>
                    }
                  </div>
                </form>

                @if (categoryMessage) {
                    <div class="form-message" [class.error]="isCategoryError">
                        {{ categoryMessage }}
                    </div>
                }

                <div class="categories-list mt-4">
                  @for (cat of categories$ | async; track cat.id) {
                    <div class="category-item">
                      <span class="category-preview-badge" 
                            [style.background-color]="cat.color"
                            [style.color]="productService.getContrastColor(cat.color)">
                        {{ cat.name }}
                      </span>
                      <div class="category-actions">
                        <button (click)="editCategory(cat)" class="btn-icon btn-icon-edit small" title="Modifier">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        </button>
                        <button (click)="deleteCategory(cat.id!)" class="btn-icon btn-icon-delete small" title="Supprimer">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                        </button>
                      </div>
                    </div>
                  } @empty {
                    <div class="empty-state small">
                      Aucune catégorie créée.
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <!-- Formulaire d'ajout/édition de produit -->
          <div class="form-section">
            <h2>{{ editingId ? 'Modifier le produit' : 'Ajouter un produit' }}</h2>
            <form [formGroup]="productForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <label for="brand">Marque / Titre</label>
                <input id="brand" formControlName="brand" placeholder="Ex: Création Artisanale">
              </div>

              <div class="form-group">
                <label for="type">Type / Nom</label>
                <input id="type" formControlName="type" placeholder="Ex: Sac Cabas Unique">
              </div>

              <div class="form-group">
                <label for="category">Catégorie</label>
                <div class="custom-select-wrapper">
                  <select id="category" formControlName="category">
                    <option value="">-- Choisir une catégorie --</option>
                    @for (cat of categories$ | async; track cat.id) {
                      <option [value]="cat.name">{{ cat.name }}</option>
                    }
                  </select>
                </div>
                @if ((categories$ | async)?.length === 0) {
                  <small class="error-text">Veuillez d'abord créer au moins une catégorie haut-dessus.</small>
                }
              </div>

              <div class="form-group">
                <label for="price">Prix</label>
                <input id="price" formControlName="price" placeholder="Ex: 145€">
              </div>

             <div class="form-group">
              <label for="description">Description</label>
              <textarea id="description" formControlName="description" rows="4"></textarea>
            </div>

            <div class="form-group checkbox-group">
              <label class="switch-container">
                <input type="checkbox" formControlName="isNew">
                <span class="switch-slider"></span>
              </label>
              <span class="label-text">Mettre en avant (Nouveauté)</span>
            </div>

            <!-- Images Section -->
            <div class="form-group">
              <span style="font-weight: 600; margin-bottom: 0.6rem; font-size: 0.95rem; color: #444; display: block;">Photos du produit (Max 3)</span>
              <div class="multi-image-inputs">
                @for (idx of [1, 2, 3]; track idx) {
                  <div class="image-input-group">
                    <span class="img-label">Photo {{ idx }} {{ idx === 1 ? '(Principale)' : '' }}</span>
                    <div class="image-inputs">
                      <input type="file" (change)="onFileSelected($event, idx)" [disabled]="isUploading">
                      <div class="separator">ou</div>
                      <input [formControlName]="'image' + idx" placeholder="Lien image {{ idx }}" (input)="onUrlInput(idx)">
                    </div>
                    @if (previews[idx-1]) {
                      <div class="image-preview mini">
                        <img [src]="previews[idx-1]" alt="Preview {{ idx }}">
                        <button type="button" class="btn-remove" (click)="removeImage(idx)">×</button>
                      </div>
                    }
                  </div>
                }
              </div>
              
              @if (isUploading) {
                <div class="upload-progress">
                  Upload en cours...
                </div>
              }
            </div>

            <div class="form-actions">
              <button type="button" (click)="onSubmit()" class="btn btn-primary">
                {{ editingId ? 'Mettre à jour' : 'Ajouter le produit' }}
              </button>
              @if (editingId) {
                <button type="button" (click)="cancelEdit()" class="btn btn-secondary">Annuler</button>
              }
            </div>
            
            @if (productMessage) {
                <div class="form-message" [class.error]="isProductError">
                    {{ productMessage }}
                </div>
            }
          </form>
        </div>

        

      </div>
      <!-- Liste des produits -->
        <div class="list-section">
            <div class="list-header">
                <h2>Produits ({{ (products$ | async)?.length || 0 }})</h2>
                <div class="list-actions">
                    <button (click)="seedData()" class="btn btn-secondary btn-small">Restaurer démo</button>
                    <button (click)="resetEverything()" class="btn btn-danger btn-small">Tout supprimer</button>
                </div>
            </div>
          
            @if ((products$ | async) === null) {
                <div class="loading-state">
                    Chargement des produits...
                </div>
            }

            <div class="product-list">
                <!-- On combine les produits et les catégories pour avoir les couleurs -->
                @let products = products$ | async;
                @let categories = categories$ | async;

                @for (product of products; track product.id) {
                    <div class="product-item" [class.inactive]="!product.active">
                        <img [src]="product.image" alt="miniature">
                        <div class="details">
                            <span class="name">{{ product.type }}</span>
                            @let catColor = getCategoryColor(product.category, categories || []);
                            <span class="category-badge" 
                                  [style.background-color]="catColor"
                                  [style.color]="productService.getContrastColor(catColor)">
                                {{ product.category }}
                            </span>
                             <span class="price">
                                 @if (product.price) {
                                    {{ product.price }} {{ product.price.includes('€') ? '' : '€' }}
                                 } @else {
                                    Prix sur demande
                                 }
                             </span>
                            @if (product.isNew) {
                                <span class="new-badge">Nouveauté</span>
                            }
                        </div>
                        <div class="actions">
                            <div class="visibility-status" [class.status-active]="product.active">
                                <label class="switch-container">
                                    <input type="checkbox" [checked]="product.active" (change)="toggleVisibility(product)">
                                    <span class="switch-slider"></span>
                                </label>
                                <span class="status-label">{{ product.active ? 'En ligne' : 'Masqué' }}</span>
                            </div>
                            <button (click)="editProduct(product)" class="btn-icon" title="Modifier">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            </button>
                            <button (click)="deleteProduct(product)" class="btn-icon btn-icon-delete" title="Supprimer">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        </div>
                    </div>
                } @empty {
                    @if (products !== null) {
                        <div class="empty-state">
                            Aucun produit trouvé. Ajoutez-en un !
                        </div>
                    }
                }
            </div>
        </div>
    </div>
  `,
  styles: [`
    .admin-container { padding: 100px 2rem 2rem; max-width: 1400px; margin: 0 auto; font-family: 'Inter', sans-serif; background: #fafafa; min-height: 100vh; }
    .admin-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
    .dashboard-grid { 
      display: flex !important; 
      flex-direction: row !important; 
      gap: 2.5rem; 
      align-items: start; 
      width: 100%;
    }
    
    .form-scroll-container { 
      flex: 0 0 480px; 
      width: 480px;
      display: flex; 
      flex-direction: column; 
      gap: 2rem; 
    }
    
    .list-section { 
      flex: 1; 
      min-width: 0; 
      background: white; 
      padding: 2rem; 
      border-radius: 12px; 
      box-shadow: 0 4px 20px rgba(0,0,0,0.08); 
    }
    
    @media(max-width: 1000px) { 
      .dashboard-grid { flex-direction: column !important; }
      .form-scroll-container { flex: none; width: 100%; }
    }

    .form-section { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
    .list-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #f0f0f0; padding-bottom: 1rem; }
    .list-actions { display: flex; gap: 0.8rem; }

    .mb-4 { margin-bottom: 1.5rem; }
    .mt-4 { margin-top: 1.5rem; }

    .category-form { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; background: #fdfdfd; border: 1px dashed #ccc; border-radius: 8px; }
    .color-picker-wrapper { display: flex; align-items: center; gap: 1rem; }
    .color-picker-wrapper input[type="color"] { width: 50px; height: 40px; border: none; padding: 0; background: none; cursor: pointer; }
    .categories-list { display: flex; flex-wrap: wrap; gap: 0.8rem; }
    .category-item { display: flex; align-items: center; gap: 0.8rem; background: #fff; padding: 6px 12px; border-radius: 20px; border: 1px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
    .category-preview-badge { font-size: 0.75rem; color: white; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.2); letter-spacing: 0.5px; }
    .category-actions { display: flex; gap: 0.4rem; border-left: 1px solid #eee; padding-left: 0.4rem; }
    .btn-icon.small { padding: 4px; border-radius: 50%; }
    .btn-icon-edit:hover { background: #eef2ff; color: #4f46e5; }
    .error-text { color: #c62828; font-size: 0.8rem; margin-top: 5px; font-weight: 500; }

    .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; }
    .form-group label { font-weight: 600; margin-bottom: 0.6rem; font-size: 0.95rem; color: #444; }
    .form-group input, .form-group select, .form-group textarea { padding: 0.9rem; border: 1px solid #e0e0e0; border-radius: 8px; font-family: inherit; transition: border-color 0.2s; }
    .form-group input:focus { outline: none; border-color: #7a5dfa; }

    .multi-image-inputs { display: flex; flex-direction: column; gap: 1.5rem; }
    .image-input-group { background: #f9f9f9; padding: 1.2rem; border-radius: 10px; border: 1px solid #eee; position: relative; }
    .img-label { display: block; font-size: 0.85rem; font-weight: 700; color: #666; margin-bottom: 0.8rem; text-transform: uppercase; }
    .image-inputs { display: flex; flex-direction: column; gap: 0.8rem; }
    .image-inputs .separator { text-align: center; font-size: 0.8rem; color: #888; font-weight: 600; }

    .image-preview.mini { position: relative; width: 100px; height: 100px; margin-top: 1rem; border-radius: 8px; overflow: hidden; border: 2px solid #7a5dfa; }
    .image-preview.mini img { width: 100%; height: 100%; object-fit: cover; }
    .btn-remove { position: absolute; top: 2px; right: 2px; background: rgba(255, 255, 255, 0.9); border: none; border-radius: 50%; width: 20px; height: 20px; cursor: pointer; font-weight: bold; color: #ff4d4d; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }

    .form-actions { display: flex; gap: 1rem; margin-top: 2rem; }

    .product-list { display: flex; flex-direction: column; gap: 1.2rem; }
    .product-item { display: flex; align-items: center; gap: 1.2rem; padding: 1.2rem; border: 1px solid #f0f0f0; border-radius: 10px; transition: all 0.2s ease; }
    .product-item:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .product-item.inactive { opacity: 0.75; background: #fcfcfc; }
    .product-item img { width: 70px; height: 70px; object-fit: cover; border-radius: 8px; background: #eee; }
    .product-item .details { flex: 1; display: flex; flex-direction: column; }
    .product-item .details .name { font-weight: 700; font-size: 1.05rem; color: #333; }
    .product-item .details .price { color: #666; font-size: 0.95rem; margin-top: 4px; font-weight: 500; }

    .category-badge { font-size: 0.75rem; background: #f0f0f0; padding: 3px 10px; border-radius: 20px; width: fit-content; margin-top: 6px; color: #555; text-transform: uppercase; font-weight: 600; }

    .actions { display: flex; align-items: center; gap: 1rem; }

    .btn-icon { background: #f5f5f5; border: none; cursor: pointer; padding: 10px; display: flex; align-items: center; justify-content: center; color: #555; transition: all 0.2s; border-radius: 10px; }
    .btn-icon:hover { background: #eee; color: #7a5dfa; }
    .btn-icon-delete:hover { background: #ffebeb; color: #ff4d4d; }

    .section-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
    .section-header h2 { margin: 0; }

    .category-section.collapsed { padding-bottom: 1rem; }
    .collapsible-content { margin-top: 1.5rem; border-top: 1px solid #f0f0f0; padding-top: 1.5rem; }

    /* --- SWITCH CSS (NEW & ROBUST) --- */
    .visibility-status { display: flex; align-items: center; gap: 0.8rem; padding-right: 1rem; border-right: 1px solid #eee; min-width: 140px; }
    
    .switch-container { position: relative; display: inline-block; width: 44px; height: 24px; vertical-align: middle; }
    .switch-container input { opacity: 0; width: 0; height: 0; }
    
    .switch-slider {
      position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
      background-color: #ccc; transition: .4s; border-radius: 34px;
    }
    .switch-slider:before {
      position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px;
      background-color: white; transition: .4s; border-radius: 50%;
    }
    input:checked + .switch-slider { background-color: #7a5dfa; }
    input:checked + .switch-slider:before { transform: translateX(20px); }

    .status-label { font-size: 0.8rem; font-weight: 600; color: #999; text-transform: uppercase; min-width: 65px; text-align: right; }
    .status-active .status-label { color: #7a5dfa; }

    /* --- BUTTONS --- */
    .btn { padding: 0.9rem 1.8rem; border-radius: 8px; cursor: pointer; font-weight: 700; transition: all 0.2s; border: none; font-family: inherit; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .btn-primary { background: #7a5dfa; color: white; box-shadow: 0 4px 10px rgba(122, 93, 250, 0.3); }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 15px rgba(122, 93, 250, 0.4); }
    .btn-secondary { background: #f5f5f5; color: #444; border: 1px solid #e0e0e0; }
    .btn-secondary:hover { background: #eee; }
    .btn-danger { color: #ff4d4d; border: 1px solid #ff4d4d; background: transparent; }
    .btn-danger:hover { background: #fff5f5; }
    .btn-logout { background: white; color: #333; border: 1px solid #333; }
    .btn-logout:hover { background: #333; color: white; }
    .btn-small { padding: 0.5rem 1rem; font-size: 0.8rem; }

    .form-message { margin-top: 1.5rem; padding: 1rem; border-radius: 8px; background: #e8f5e9; color: #2e7d32; font-size: 0.95rem; font-weight: 500; border-left: 4px solid #2e7d32; }
    .form-message.error { background: #ffebee; color: #c62828; border-color: #c62828; border-left-color: #c62828; }

    .checkbox-group { display: flex; flex-direction: row !important; align-items: center; gap: 1rem; margin-top: 0.5rem; }
    .label-text { font-weight: 600; color: #444; }
    
    .new-badge { font-size: 0.7rem; background: var(--color-accent-purple, #513a58); color: white; padding: 2px 8px; border-radius: 4px; width: fit-content; margin-top: 4px; font-weight: 700; text-transform: uppercase; }
  `]
})
export class AdminDashboardComponent {
  authService = inject(AuthService);
  productService = inject(ProductService);
  router = inject(Router);
  fb = inject(FormBuilder);
  cdr = inject(ChangeDetectorRef);

  constructor() {
    console.log('[Admin] Composant initialisé (v2)');
  }

  products$: Observable<Product[]> = this.productService.getProducts().pipe(
    tap(products => console.log('🛒 [Admin] Produits reçus:', products?.length)),
    shareReplay(1)
  );
  categories$: Observable<Category[]> = this.productService.getCategories().pipe(
    tap(cats => console.log('📂 [Admin] Catégories reçues:', cats?.length, cats)),
    shareReplay(1)
  );

  productForm: FormGroup = this.fb.group({
    brand: ['', Validators.required],
    type: ['', Validators.required],
    category: ['', Validators.required],
    price: [''],
    description: ['', Validators.required],
    badge: [''],
    image1: ['', Validators.required],
    image2: [''],
    image3: [''],
    isNew: [false]
  });

  editingId: string | null = null;
  editingCategoryId: string | null = null;
  isUploading = false;
  isCategoryLoading = false;
  isCategoryCollapsed = true; // Default to collapsed to save space
  uploadProgress = 0;

  productMessage = '';
  isProductError = false;

  categoryMessage = '';
  isCategoryError = false;

  previews: (string | null)[] = [null, null, null];

  categoryForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    color: ['#7a5dfa', Validators.required]
  });

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

  async onFileSelected(event: Event, index: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.isUploading = true;
      try {
        const url = await this.productService.uploadImage(file);
        this.productForm.get('image' + index)?.setValue(url);
        this.previews[index - 1] = url;
        this.productMessage = `Image ${index} téléchargée !`;
        this.isProductError = false;
      } catch (error) {
        console.error('Upload failed', error);
        this.productMessage = 'Erreur lors du téléchargement de l\'image.';
        this.isProductError = true;
      } finally {
        this.isUploading = false;
      }
    }
  }

  onUrlInput(index: number) {
    const url = this.productForm.get('image' + index)?.value;
    if (url && url.startsWith('http')) {
      this.previews[index - 1] = url;
    }
  }

  removeImage(index: number) {
    this.productForm.get('image' + index)?.setValue('');
    this.previews[index - 1] = null;
  }

  async onSubmit() {
    console.log('[Admin] Tentative de soumission du formulaire produit...');
    this.isProductError = false;

    if (this.productForm.invalid) {
      console.warn('[Admin] Product form invalid');
      const invalidControls = [];
      const controls = this.productForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalidControls.push(name);
        }
      }

      const labels: Record<string, string> = {
        brand: 'Marque',
        type: 'Type/Nom',
        category: 'Catégorie',
        price: 'Prix',
        description: 'Description',
        image1: 'Image principale'
      };

      const missingLabels = invalidControls.map(name => labels[name] || name);
      this.productMessage = `Formulaire incomplet. Veuillez remplir : ${missingLabels.join(', ')}`;
      this.isProductError = true;
      return;
    }

    this.isUploading = true;
    this.productMessage = 'Enregistrement en cours...';
    this.isProductError = false;
    this.cdr.detectChanges();

    const formVal = this.productForm.value;
    const imagesArray = [formVal.image1, formVal.image2, formVal.image3].filter(img => !!img);

    const productData: Product = {
      brand: formVal.brand,
      type: formVal.type,
      category: formVal.category,
      price: formVal.price,
      description: formVal.description,
      badge: formVal.badge || '',
      badgeColor: 'accent-purple',
      image: formVal.image1, // Primary
      images: imagesArray,
      sizes: ['Taille Unique'],
      active: true,
      isNew: formVal.isNew || false
    };

    console.log('[Admin] Données du produit prêtes :', productData);

    try {
      if (this.editingId) {
        await this.productService.updateProduct(this.editingId, productData);
        this.productMessage = 'Produit mis à jour avec succès !';
        this.isProductError = false;
      } else {
        await this.productService.addProduct(productData);
        this.productMessage = 'Produit ajouté avec succès !';
        this.isProductError = false;
      }
      this.resetForm();
    } catch (error: unknown) {
      console.error('[Admin] ÉCHEC de l\'opération :', error);
      this.productMessage = `Erreur : ${(error as Error).message || 'Problème de connexion à Firestore'}`;
      this.isProductError = true;
    } finally {
      this.isUploading = false;
      this.cdr.detectChanges();
    }
  }

  editProduct(product: Product) {
    if (!product.id) return;
    this.editingId = product.id;

    // Prepare form data
    const formData = {
      ...product,
      image1: product.images?.[0] || product.image,
      image2: product.images?.[1] || '',
      image3: product.images?.[2] || ''
    };

    this.productForm.patchValue({
      ...formData,
      isNew: product.isNew || false
    });
    this.previews = [
      product.images?.[0] || product.image,
      product.images?.[1] || null,
      product.images?.[2] || null
    ];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.resetForm();
  }

  getCategoryColor(categoryName: string, categories: Category[]): string {
    const cat = categories.find(c => c.name === categoryName);
    return cat ? cat.color : '#f0f0f0';
  }

  private resetForm() {
    this.editingId = null;
    this.productForm.reset({ category: '' });
    this.previews = [null, null, null];
    this.cdr.detectChanges();
    setTimeout(() => {
      if (!this.isProductError) this.productMessage = '';
      this.cdr.detectChanges();
    }, 3000);
  }

  async onAddCategory() {
    console.log('[Admin] onAddCategory called, editingCategoryId:', this.editingCategoryId);
    if (this.categoryForm.invalid) {
      console.warn('[Admin] Category form invalid');
      return;
    }

    this.isCategoryLoading = true;
    this.categoryMessage = this.editingCategoryId ? 'Mise à jour de la catégorie...' : 'Ajout de la catégorie...';
    this.isCategoryError = false;
    this.cdr.detectChanges();

    try {
      const catData = this.categoryForm.value;
      if (this.editingCategoryId) {
        await this.productService.updateCategory(this.editingCategoryId, catData);
        this.categoryMessage = 'Catégorie mise à jour !';
      } else {
        await this.productService.addCategory(catData);
        this.categoryMessage = 'Catégorie ajoutée !';
      }
      this.editingCategoryId = null;
      this.categoryForm.reset({ color: '#7a5dfa' });
      this.isCategoryError = false;
    } catch (error: unknown) {
      console.error('[Admin] Error saving category:', error);
      this.categoryMessage = 'Erreur : ' + ((error as Error).message || 'Firestore error');
      this.isCategoryError = true;
    } finally {
      this.isCategoryLoading = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        if (!this.isCategoryError) this.categoryMessage = '';
        this.cdr.detectChanges();
      }, 3000);
    }
  }

  editCategory(cat: Category) {
    if (!cat.id) return;
    this.editingCategoryId = cat.id;
    this.categoryForm.patchValue({
      name: cat.name,
      color: cat.color
    });
    this.categoryMessage = `Modification de : ${cat.name}`;
    this.isCategoryError = false;
    this.cdr.detectChanges();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelCategoryEdit() {
    this.editingCategoryId = null;
    this.categoryForm.reset({ color: '#7a5dfa' });
    this.categoryMessage = '';
    this.isCategoryError = false;
    this.cdr.detectChanges();
  }

  async deleteCategory(id: string) {
    if (confirm('Supprimer cette catégorie ? Les produits resteront dans cette catégorie mais elle n\'existera plus dans la liste.')) {
      this.isCategoryLoading = true;
      this.cdr.detectChanges();
      try {
        await this.productService.deleteCategory(id);
        this.categoryMessage = 'Catégorie supprimée.';
        this.isCategoryError = false;
      } catch (error: unknown) {
        console.error('Error deleting category', error);
        this.categoryMessage = 'Erreur : ' + ((error as Error).message || 'Firestore error');
        this.isCategoryError = true;
      } finally {
        this.isCategoryLoading = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          if (!this.isCategoryError) this.categoryMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    }
  }

  async toggleVisibility(product: Product) {
    if (!product.id) return;
    try {
      await this.productService.updateProduct(product.id, { active: !product.active });
      console.log(`Product ${product.id} visibility toggled to ${!product.active}`);
    } catch (error) {
      console.error('Toggle visibility failed', error);
    }
  }

  async deleteProduct(product: Product) {
    if (!product.id) return;
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await this.productService.deleteProduct(product.id);
        console.log(`Product ${product.id} deleted.`);
      } catch (error) {
        console.error('Error deleting product', error);
      }
    }
  }

  async resetEverything() {
    if (!confirm('ATTENTION: Cela va supprimer TOUS les produits de la base de données. Continuer ?')) return;

    this.isUploading = true;
    try {
      await this.productService.deleteAllProducts();
      this.productMessage = 'Base de données vidée !';
      this.isProductError = false;
      this.resetForm();
    } catch (error) {
      console.error('Reset failed', error);
      this.productMessage = 'Erreur lors de la réinitialisation.';
      this.isProductError = true;
    } finally {
      this.isUploading = false;
    }
  }

  async seedData() {
    if (confirm('Voulez-vous restaurer les produits de démonstration ?')) {
      this.isUploading = true;
      this.productMessage = 'Restauration en cours...';
      this.isProductError = false;
      this.cdr.detectChanges();
      try {
        await this.productService.seedProducts();
        this.productMessage = 'Produits de démonstration restaurés !';
        this.isProductError = false;
      } catch (error) {
        console.error('Seed failed', error);
        this.productMessage = 'Erreur lors de la restauration.';
        this.isProductError = true;
      } finally {
        this.isUploading = false;
        this.cdr.detectChanges();
        setTimeout(() => {
          if (!this.isProductError) this.productMessage = '';
          this.cdr.detectChanges();
        }, 3000);
      }
    }
  }
}
