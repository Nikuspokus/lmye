import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable, throwError } from 'rxjs';

export interface Product {
    id?: string;
    image: string;
    images: string[]; // Up to 3 images
    brand: string;
    type: string;
    category: 'Sac' | 'Pochette' | 'Accessoire';
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
    constructor(
        private firestore: Firestore,
        private storage: Storage
    ) { }

    getProducts(): Observable<Product[]> {
        console.log('🚀 Fetching products from Firestore (Manual Observable)...');
        return new Observable<Product[]>(subscriber => {
            let unsubscribe: any;
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

    async addProduct(product: Product): Promise<any> {
        console.log('Adding product to Firestore...', product);
        try {
            const productsCollection = collection(this.firestore, 'products');
            const docRef = await addDoc(productsCollection, product);
            console.log('✅ Product added successfully with ID:', docRef.id);
            return docRef;
        } catch (error: any) {
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
        const initialProducts: any[] = [
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
                badge: 'Nouveauté',
                badgeColor: 'accent-purple',
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
                badge: 'Vente Flash',
                badgeColor: 'accent-pink',
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
}
