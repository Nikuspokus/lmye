import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, getDocs } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

export interface Category {
    id?: string;
    name: string;
    color: string;
}

export interface Product {
    id?: string;
    image: string;
    images: string[]; // Up to 3 images
    brand: string;
    type: string;
    category: string;
    price?: string;
    description: string;
    badge?: string;
    badgeColor?: string;
    sizes: string[];
    active: boolean;
    isNew?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private firestore = inject(Firestore);
    private storage = inject(Storage);



    // --- CATEGORY METHODS ---
    getCategories(): Observable<Category[]> {
        return new Observable<Category[]>(subscriber => {
            const categoriesCollection = collection(this.firestore, 'categories');
            const q = query(categoriesCollection, orderBy('name'));

            return onSnapshot(q, (snapshot) => {
                const categories = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Category[];
                subscriber.next(categories);
            }, (error) => subscriber.error(error));
        });
    }

    async addCategory(category: Category): Promise<unknown> {
        console.log('📦 [ProductService] Adding category to Firestore...', category);
        try {
            const categoriesCollection = collection(this.firestore, 'categories');
            const docRef = await addDoc(categoriesCollection, category);
            console.log('✅ [ProductService] Category added with ID:', docRef.id);
            return docRef;
        } catch (error) {
            console.error('❌ [ProductService] Error adding category:', error);
            throw error;
        }
    }

    async updateCategory(id: string, data: Partial<Category>): Promise<void> {
        console.log(`📦 [ProductService] Updating category ${id}...`, data);
        try {
            const docRef = doc(this.firestore, 'categories', id);
            await updateDoc(docRef, data);
            console.log('✅ [ProductService] Category updated successfully');
        } catch (error) {
            console.error('❌ [ProductService] Error updating category:', error);
            throw error;
        }
    }

    async deleteCategory(id: string): Promise<void> {
        console.log(`🗑️ [ProductService] Deleting category ${id}...`);
        try {
            const docRef = doc(this.firestore, 'categories', id);
            await deleteDoc(docRef);
            console.log('✅ [ProductService] Category deleted successfully');
        } catch (error) {
            console.error('❌ [ProductService] Error deleting category:', error);
            throw error;
        }
    }

    // --- PRODUCT METHODS ---

    getProducts(): Observable<Product[]> {
        console.log('🚀 Fetching products from Firestore (Manual Observable)...');
        return new Observable<Product[]>(subscriber => {
            let unsubscribe: () => void;
            try {
                const productsCollection = collection(this.firestore, 'products');

                unsubscribe = onSnapshot(productsCollection,
                    (snapshot) => {
                        const products = snapshot.docs.map(doc => {
                            const data = doc.data();
                            return { id: doc.id, ...data } as Product;
                        });
                        console.log('✅ Data received from Firestore:', products);
                        subscriber.next(products);
                    },
                    (error) => {
                        console.error('❌ Firestore subscription error:', error);
                        subscriber.error(error);
                    }
                );
            } catch (error) {
                console.error('❌ Critical error in getProducts initialization:', error);
                subscriber.error(error);
            }
            return () => { if (unsubscribe) unsubscribe(); };
        });
    }

    getProductById(id: string): Observable<Product | undefined> {
        return new Observable<Product | undefined>(subscriber => {
            const productsSub = this.getProducts().subscribe({
                next: (products) => {
                    subscriber.next(products.find(p => p.id === id));
                },
                error: (err) => subscriber.error(err)
            });
            return () => productsSub.unsubscribe();
        });
    }

    async addProduct(product: Product): Promise<unknown> {
        console.log('Adding product to Firestore...', product);
        try {
            const productsCollection = collection(this.firestore, 'products');
            const docRef = await addDoc(productsCollection, product);
            console.log('✅ Product added successfully with ID:', docRef.id);
            return docRef;
        } catch (error: unknown) {
            console.error('❌ Error adding product to Firestore:', error);
            throw error;
        }
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<void> {
        console.log(`Updating product ${id}...`, data);
        try {
            const docRef = doc(this.firestore, 'products', id);
            await updateDoc(docRef, data);
            console.log('✅ Product updated successfully');
        } catch (error) {
            console.error('❌ Error updating product:', error);
            throw error;
        }
    }

    async deleteProduct(id: string): Promise<void> {
        console.log(`Deleting product ${id}...`);
        try {
            const docRef = doc(this.firestore, 'products', id);
            await deleteDoc(docRef);
            console.log('✅ Product deleted successfully');
        } catch (error) {
            console.error('❌ Error deleting product:', error);
            throw error;
        }
    }

    async uploadImage(file: File): Promise<string> {
        console.log('Uploading image to Storage...', file.name);
        try {
            const filePath = `products/${Date.now()}_${file.name}`;
            const storageRef = ref(this.storage, filePath);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            console.log('✅ Image uploaded successfully:', url);
            return url;
        } catch (error) {
            console.error('❌ Error uploading image to Storage:', error);
            throw error;
        }
    }

    getSuggestions(currentId: string | undefined): Observable<Product[]> {
        return new Observable<Product[]>(subscriber => {
            const productsSub = this.getProducts().subscribe({
                next: (products) => {
                    const otherProducts = products.filter(p => p.id !== currentId);
                    const shuffled = otherProducts.sort(() => 0.5 - Math.random());
                    subscriber.next(shuffled.slice(0, 3));
                },
                error: (err) => subscriber.error(err)
            });
            return () => productsSub.unsubscribe();
        });
    }

    async deleteAllProducts() {
        console.log('🗑️ Deleting all products...');
        const productsCollection = collection(this.firestore, 'products');
        // We get a one-shot snapshot to delete everything
        return new Promise<void>((resolve, reject) => {
            const unsubscribe = onSnapshot(productsCollection, async (snapshot) => {
                unsubscribe();
                try {
                    for (const doc of snapshot.docs) {
                        await this.deleteProduct(doc.id);
                    }
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }, (err) => reject(err));
        });
    }

    async seedProducts() {
        console.log('🌱 Seeding default categories and products...');

        // 1. Seed Categories first
        const defaultCategories: Category[] = [
            { name: 'Sac', color: '#7a5dfa' },
            { name: 'Pochette', color: '#ff4d4d' },
            { name: 'Accessoire', color: '#ff9800' }
        ];

        for (const cat of defaultCategories) {
            // Check if already exists by name
            const existing = await this.getCategoriesOnce();
            if (!existing.some(c => c.name === cat.name)) {
                await this.addCategory(cat);
            }
        }

        // 2. Seed Products
        const initialProducts: Product[] = [
            {
                brand: 'La Marque y Est',
                type: 'Le Muse',
                category: 'Sac',
                price: '220€',
                description: 'Un sac cabas élégant et spacieux, parfait pour toutes les occasions. Fabriqué avec soin dans notre atelier.',
                image: 'assets/images/518823617_122176082222352067_1998949892650660751_n.jpg',
                images: [
                    'assets/images/518823617_122176082222352067_1998949892650660751_n.jpg',
                    'assets/images/518214241_122176082156352067_2159092796332586704_n.jpg',
                    'assets/images/503705126_10230535106655575_470912678716942903_n.jpg'
                ],
                sizes: ['Taille Unique'],
                active: true,
                isNew: true
            },
            {
                brand: 'La Marque y Est',
                type: 'L’Éclat',
                category: 'Sac',
                price: '180€',
                description: 'Un sac à main raffiné avec des finitions dorées. L’élégance à la française.',
                image: 'assets/images/518214241_122176082156352067_2159092796332586704_n.jpg',
                images: [
                    'assets/images/518214241_122176082156352067_2159092796332586704_n.jpg',
                    'assets/images/493059193_122172773120352067_3252055687442239257_n.jpg',
                    'assets/images/518823617_122176082222352067_1998949892650660751_n.jpg'
                ],
                sizes: ['Taille Unique'],
                active: true,
                isNew: false
            },
            {
                brand: 'La Marque y Est',
                type: 'La Perle',
                category: 'Pochette',
                price: '85€',
                description: 'Une pochette délicate pour vos soirées. Légère et sophistiquée.',
                image: 'assets/images/503705126_10230535106655575_470912678716942903_n.jpg',
                images: [
                    'assets/images/503705126_10230535106655575_470912678716942903_n.jpg',
                    'assets/images/518823617_122176082222352067_1998949892650660751_n.jpg',
                    'assets/images/518214241_122176082156352067_2159092796332586704_n.jpg'
                ],
                sizes: ['Taille Unique'],
                active: true,
                isNew: false
            }
        ];

        for (const p of initialProducts) {
            await this.addProduct(p);
        }
    }

    private async getCategoriesOnce(): Promise<Category[]> {
        const categoriesCollection = collection(this.firestore, 'categories');
        const snapshot = await getDocs(categoriesCollection);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    }

    /**
     * Calcule la couleur de contraste (noir ou blanc) pour une couleur hexadécimale donnée.
     */
    getContrastColor(hexColor: string): 'white' | 'black' {
        if (!hexColor) return 'white';

        // Retirer le # si présent
        const color = hexColor.replace('#', '');

        // Fallback si la couleur est mal formatée
        if (color.length !== 6 && color.length !== 3) return 'white';

        let r, g, b;
        if (color.length === 6) {
            r = parseInt(color.substr(0, 2), 16);
            g = parseInt(color.substr(2, 2), 16);
            b = parseInt(color.substr(4, 2), 16);
        } else {
            r = parseInt(color[0] + color[0], 16);
            g = parseInt(color[1] + color[1], 16);
            b = parseInt(color[2] + color[2], 16);
        }

        // Calculer la luminosité (formule standard YIQ)
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

        // Retourner blanc pour les couleurs sombres (< 128) et noir pour les claires
        return (yiq >= 128) ? 'black' : 'white';
    }
}
