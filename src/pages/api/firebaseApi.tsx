import { useEffect, useRef, useState } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
	CollectionReference,
	Firestore,
	Query,
	addDoc,
	collection,
	deleteDoc,
	doc,
	getFirestore,
	onSnapshot,
	orderBy,
	query,
	serverTimestamp,
	updateDoc,
} from "firebase/firestore";
import {
	createUserWithEmailAndPassword,
	Auth,
	getAuth,
	sendEmailVerification,
	UserCredential,
	signInWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
} from "firebase/auth";

const firebaseConfig = {
	apiKey: "AIzaSyDetapdvyXWk9GParxqPi1YudSyCOnSbyc",
	authDomain: "todo-list-web-app-3329a.firebaseapp.com",
	projectId: "todo-list-web-app-3329a",
	storageBucket: "todo-list-web-app-3329a.appspot.com",
	messagingSenderId: "26673966045",
	appId: "1:26673966045:web:22be18e3d54b36ba03e434",
	measurementId: "G-PBC8GGMJYC",
};

const app: FirebaseApp = initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);

const colRefRegistration: CollectionReference = collection(db, "registration", "");

const colRefFolders: CollectionReference = collection(db, "folders", "");
const queFolders: Query = query(colRefFolders, orderBy("createdTime"));

const colRefTodoFolders: CollectionReference = collection(db, "todo-folders", "");
const queTodoFolders: Query = query(colRefTodoFolders, orderBy("createdTime"));

const colRefTodoLists: CollectionReference = collection(db, "todo-lists", "");
const queTodoLists: Query = query(colRefTodoLists, orderBy("createdTime"));

// ADD HERE -----

// ==================

export default function FirebaseApi() {
	// Registration System ======
	const [allusers, setAllusers] = useState<any>();
	const [errorMesg, setErrorMesg] = useState<string>("");
	const [successfulSignin, setSuccessfulSignin] = useState<string>("");
	const errorMesgRef = useRef<any>();
	const successfulSigninRef = useRef<any>();

	const [allTodoLists, setAllTodoLists] = useState<any>();
	const [allFolders, setAllFolders] = useState<any>();
	const [allTodoFolders, setAllTodoFolders] = useState<any>();

	// Registration System ======
	useEffect(() => {
		onSnapshot(colRefRegistration, (ss) => {
			const users: any = [];
			setAllusers(users);

			ss.docs.map((doc) => {
				users.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});
	}, []);

	// Folder System ======
	useEffect(() => {
		onSnapshot(queFolders, (ss) => {
			const folders: any = [];
			setAllFolders(folders);

			ss.docs.map((doc) => {
				folders.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});
	}, []);

	// T0do Folders System ======
	useEffect(() => {
		onSnapshot(queTodoFolders, (ss) => {
			const todoFolders: any = [];
			setAllTodoFolders(todoFolders);

			ss.docs.map((doc) => {
				todoFolders.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});
	}, []);

	// T0do List System ======
	useEffect(() => {
		onSnapshot(queTodoLists, (ss) => {
			const todos: any = [];
			setAllTodoLists(todos);

			ss.docs.map((doc) => {
				todos.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});
	}, []);

	class RegistrationSystem {
		constructor() {}

		signingUp = async (email: string, password: string, username: string) => {
			try {
				const user: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
				await sendEmailVerification(user.user);
			} catch (err) {
				console.log(`Adding User Credentials Error |`, err.message);
			}

			try {
				await addDoc(colRefRegistration, {
					email: email,
					username: username,
					userID: auth.currentUser.uid,
					themeColor: false,
					bannerImage: "",
					bannerSize: false,
				});
			} catch (err) {
				console.log(`Adding To Database Error |`, err.message);
			}
		};

		updatingThemeColor = async (themeColor: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				themeColor: themeColor,
			});
		};

		updatingBannerImage = async (bannerImage: string, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				bannerImage: bannerImage,
			});
		};

		updatingBannerSize = async (bannerSize: boolean, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				bannerSize: bannerSize,
			});
		};

		signingIn = async (email: string, password: string) => {
			try {
				await signInWithEmailAndPassword(auth, email, password);
				setSuccessfulSignin("Successful Sign In");
				successfulSigninRef.current = setTimeout(() => {
					setSuccessfulSignin("");
					clearTimeout(successfulSigninRef.current);
				}, 3000);
			} catch (err) {
				setErrorMesg(err.message);
				errorMesgRef.current = setTimeout(() => {
					setErrorMesg("");
					clearTimeout(errorMesgRef.current);
				}, 5000);
			}
		};

		signingOut = async () => {
			try {
				await signOut(auth);
			} catch (err) {
				console.log(`Signing Out Error |`, err.message);
			}
		};

		forgotPassword = async (email: string) => {
			try {
				await sendPasswordResetEmail(auth, email);
			} catch (err) {
				console.log(`Forgot Password Error |`, err.message);
			}
		};
	}
	const RS = new RegistrationSystem();
	const signingUp = RS.signingUp;
	const updatingThemeColor = RS.updatingThemeColor;
	const updatingBannerImage = RS.updatingBannerImage;
	const updatingBannerSize = RS.updatingBannerSize;
	const signingIn = RS.signingIn;
	const signingOut = RS.signingOut;
	const forgotPassword = RS.forgotPassword;

	class FolderSystem {
		constructor() {}

		addingFolder = async (folderName: string) => {
			await addDoc(colRefFolders, {
				folderName: folderName,
				userID: auth.currentUser.uid,
				createdTime: serverTimestamp(),
				completed: false,
			});
		};

		updatingCompletionFolder = async (id: string, completedFolder: boolean) => {
			const docRef = doc(colRefFolders, id);
			await updateDoc(docRef, {
				completed: completedFolder,
			});
		};

		deletingFolder = async (id: string) => {
			const docRef = doc(colRefFolders, id);
			await deleteDoc(docRef);
		};
	}
	const FS = new FolderSystem();
	const addingFolder = FS.addingFolder;
	const updatingCompletionFolder = FS.updatingCompletionFolder;
	const deletingFolder = FS.deletingFolder;

	class TodolistFolderSystem {
		constructor() {}

		addingTodoFolder = async (
			folderEmoji: string,
			folderTitle: string,
			folderDescription: string,
			folderName: string
		) => {
			await addDoc(colRefTodoFolders, {
				folderEmoji: folderEmoji || "",
				folderTitle: folderTitle,
				folderDescription:
					folderDescription ||
					"Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing layouts and visual mockups.",
				folderName: folderName,
				completed: false,
				userID: auth.currentUser.uid,
				createdTime: serverTimestamp(),
			});
		};

		updatingCompletion = async (id: string, completed: boolean) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				completed: completed,
			});
		};

		updatingFolderTitle = async (id: string, folderTitle: string) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				folderTitle: folderTitle,
			});
		};

		updatingFolderEmoji = async (id: string, folderEmoji: string) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				folderEmoji: folderEmoji,
			});
		};

		updatingFolderDescription = async (id: string, folderDescription: string) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				folderDescription: folderDescription,
			});
		};

		deletingTodoFolder = async (id: string) => {
			const docRef = doc(colRefTodoFolders, id);
			await deleteDoc(docRef);
		};
	}
	const TLFS = new TodolistFolderSystem();
	const addingTodoFolder = TLFS.addingTodoFolder;
	const deletingTodoFolder = TLFS.deletingTodoFolder;
	const updatingCompletion = TLFS.updatingCompletion;
	const updatingFolderTitle = TLFS.updatingFolderTitle;
	const updatingFolderEmoji = TLFS.updatingFolderEmoji;
	const updatingFolderDescription = TLFS.updatingFolderDescription;

	class TodoListSystem {
		constructor() {}

		addingTodos = async (folderID: string) => {
			await addDoc(colRefTodoLists, {
				todo: "Untitled Todo Text",
				folderID: folderID,
				favorited: false,
				completed: false,
				userID: auth.currentUser.uid,
				createdTime: serverTimestamp(),
			});
		};

		updatingTodolist = async (id: string, todo: string) => {
			const docRef = doc(colRefTodoLists, id);
			await updateDoc(docRef, {
				todo: todo,
			});
		};

		updatingTodolistFavorite = async (id: string, favorited: string) => {
			const docRef = doc(colRefTodoLists, id);
			await updateDoc(docRef, {
				favorited: favorited,
			});
		};

		updatingTodolistCompleted = async (id: string, completed: string) => {
			const docRef = doc(colRefTodoLists, id);
			await updateDoc(docRef, {
				completed: completed,
			});
		};

		deletingTodolist = async (id: string) => {
			const docRef = doc(colRefTodoLists, id);
			await deleteDoc(docRef);
		};
	}
	const TLS = new TodoListSystem();
	const addingTodos = TLS.addingTodos;
	const updatingTodolist = TLS.updatingTodolist;
	const updatingTodolistFavorite = TLS.updatingTodolistFavorite;
	const updatingTodolistCompleted = TLS.updatingTodolistCompleted;
	const deletingTodolist = TLS.deletingTodolist;

	return {
		auth,
		registration: {
			successfulSignin,
			errorMesg,
			allusers,
			signingUp,
			updatingThemeColor,
			updatingBannerImage,
			updatingBannerSize,
			signingIn,
			signingOut,
			forgotPassword,
		},
		folders: {
			allFolders,
			addingFolder,
			updatingCompletionFolder,
			deletingFolder,
		},
		todolistFolders: {
			updatingFolderDescription,
			updatingFolderTitle,
			updatingFolderEmoji,
			updatingCompletion,
			deletingTodoFolder,
			addingTodoFolder,
			allTodoFolders,
		},
		todoLists: {
			allTodoLists,
			addingTodos,
			updatingTodolist,
			deletingTodolist,
			updatingTodolistFavorite,
			updatingTodolistCompleted,
		},
	};
}
