import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc, getDocs, query, where } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB8Fa3BO-EHlff2cM528GiilzvCFy_RUhk",
  authDomain: "cute-base.firebaseapp.com",
  projectId: "cute-base",
  storageBucket: "cute-base.firebasestorage.app",
  messagingSenderId: "G-CS2STKSPB3",
  appId: "1:685170946554:web:1b23f836200b154958f443"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// حفظ الطلب
export const createOrder = async (order: any) => {
  await setDoc(doc(db, "orders", order.id), {
    ...order,
    createdAt: new Date().toISOString()
  });
};

// جلب الطلب
export const getOrderByOrderNo = async (orderNo: string) => {
  const q = query(collection(db, "orders"), where("orderNo", "==", orderNo));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  }
  return null;
};