import { useEffect, useRef, useState } from "react";
import { FirebaseApp, initializeApp } from "firebase/app";
import {
	CollectionReference,
	DocumentReference,
	Firestore,
	Query,
	Timestamp,
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
	GoogleAuthProvider,
	signInWithPopup,
	FacebookAuthProvider,
	AuthProvider,
	TwitterAuthProvider,
	updateEmail,
	deleteUser,
} from "firebase/auth";
import { apiKeys } from "../../../config";

// Firebase configuration
const firebaseConfig = {
	apiKey: apiKeys.firebaseAPIKey,
	authDomain: "todo-list-web-app-3329a.firebaseapp.com",
	projectId: "todo-list-web-app-3329a",
	storageBucket: "todo-list-web-app-3329a.appspot.com",
	messagingSenderId: "26673966045",
	appId: "1:26673966045:web:22be18e3d54b36ba03e434",
	measurementId: "G-PBC8GGMJYC",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

const colRefRegistration: CollectionReference = collection(
	db,
	"registration",
	""
);

const colRefFolders: CollectionReference = collection(db, "folders", "");
const queFolders: Query = query(colRefFolders, orderBy("createdTime"));

const colRefTodoFolders: CollectionReference = collection(
	db,
	"todo-folders",
	""
);
const queTodoFolders: Query = query(colRefTodoFolders, orderBy("createdTime"));

const colRefTodoLists: CollectionReference = collection(db, "todo-lists", "");
const queTodoLists: Query = query(
	colRefTodoLists,
	orderBy("createdTime", "asc")
);

const colRefSubTodoLists: CollectionReference = collection(
	db,
	"sub-todo-lists",
	""
);
const queSubTodoLists: Query = query(
	colRefSubTodoLists,
	orderBy("createdTime")
);

const colRefPersonalURLs: CollectionReference = collection(db, "urls", "");
const quePersonalURLs: Query = query(
	colRefPersonalURLs,
	orderBy("createdTime")
);

const colRefSavedUsers: CollectionReference = collection(
	db,
	"saved-users-uid",
	""
);
const queSavedUsers: Query = query(colRefSavedUsers, orderBy("createdTime"));

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
	const [allSubTodos, setAllSubTodos] = useState<any>();
	const [allPersonalURLs, setPersonalURLs] = useState<any>();
	const [allSavedUsers, setAllSavedUsers] = useState<any>();

	// Registration System ======
	useEffect(() => {
		const unsubscribe = onSnapshot(colRefRegistration, (ss) => {
			const users: any = [];
			setAllusers(users);

			ss.docs.map((doc) => {
				users.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});

		return () => unsubscribe();
	}, []);

	// Folder System ======
	useEffect(() => {
		const unsubscribe = onSnapshot(queFolders, (ss) => {
			const folders: any = [];
			setAllFolders(folders);

			ss.docs.map((doc) => {
				folders.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});

		return () => unsubscribe();
	}, []);

	// T0do Folders System ======
	useEffect(() => {
		const unsubscribe = onSnapshot(queTodoFolders, (ss) => {
			const todoFolders: any = [];
			setAllTodoFolders(todoFolders);

			ss.docs.map((doc) => {
				todoFolders.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});

		return () => unsubscribe();
	}, []);

	// T0do List System ======
	useEffect(() => {
		const unsubscribe = onSnapshot(queTodoLists, (ss) => {
			const todos: any = [];
			setAllTodoLists(todos);

			ss.docs.map((doc) => {
				todos.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});

		return () => unsubscribe();
	}, []);

	// Sub T0do List System ======
	useEffect(() => {
		const unsubscribe = onSnapshot(queSubTodoLists, (ss) => {
			const subTodos: any = [];
			setAllSubTodos(subTodos);

			ss.docs.map((doc) => {
				subTodos.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});

		return () => unsubscribe();
	}, []);

	// Personal URL System ======
	useEffect(() => {
		const unsubscribe = onSnapshot(quePersonalURLs, (ss) => {
			const personalURLs: any = [];
			setPersonalURLs(personalURLs);

			ss.docs.map((doc) => {
				personalURLs.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		const unsubscribe = onSnapshot(queSavedUsers, (ss) => {
			const savedUsers: any = [];
			setAllSavedUsers(savedUsers);

			ss.docs.map((doc) => {
				savedUsers.unshift({
					...doc.data(),
					id: doc.id,
				});
			});
		});

		return () => unsubscribe();
	}, []);

	class RegistrationSystem {
		constructor() {}

		signingUp = async (email: string, password: string, username: string) => {
			try {
				const user: UserCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				await sendEmailVerification(user.user);
			} catch (err) {
				console.log(`Adding User Credentials Error |`, err.message);
			}

			try {
				await addDoc(colRefRegistration, {
					email: email,
					username: username,
					userID: auth.currentUser?.uid,
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

		updatingUsername = async (username: string, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				username: username,
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

		googleProvider = async () => {
			const provider: GoogleAuthProvider = new GoogleAuthProvider();

			try {
				await signInWithPopup(auth, provider).then(async (result) => {
					const user = result.user;

					user.email &&
					allusers
						?.map((users: any) =>
							users.email.toString() === user.email ? true : false
						)
						.includes(true)
						? console.log("Signing In")
						: await addDoc(colRefRegistration, {
								email: user.email,
								username: user.displayName,
								userID: user.uid,
								themeColor: false,
								bannerImage: "",
								bannerSize: false,
								photoURL: user.photoURL,
						  });
				});
			} catch (err) {
				console.log(`Google sign in Error |`, err.message);
			}
		};

		facebookProvider = async () => {
			const provider: AuthProvider = new FacebookAuthProvider();

			try {
				await signInWithPopup(auth, provider).then(async (result) => {
					const user = result.user;

					if (
						user.email &&
						allusers
							?.map((users: any) => users.email === user.email)
							.includes(true)
					) {
						console.log(null);
					} else {
						await addDoc(colRefRegistration, {
							email: user.email,
							username: user.displayName,
							userID: user.uid,
							themeColor: false,
							bannerImage: "",
							bannerSize: false,
						});
					}
				});
			} catch (err) {
				console.log(`Facebook sign in Error |`, err.message);
			}
		};

		twitterProvider = async () => {
			const provider: AuthProvider = new TwitterAuthProvider();

			try {
				await signInWithPopup(auth, provider).then(async (result) => {
					const user = result.user;

					if (
						user.email &&
						allusers
							?.map((users: any) => users.email === user.email)
							.includes(true)
					) {
						console.log(null);
					} else {
						await addDoc(colRefRegistration, {
							username: user.displayName,
							userID: user.uid,
							themeColor: false,
							bannerImage: "",
							bannerSize: false,
						});
					}
				});
			} catch (err) {
				console.log(`Twitter sign in Error |`, err.message);
			}
		};

		updatingUserEmail = async (email: string) => {
			await updateEmail(auth?.currentUser, email);
		};

		updatingProfileImage = async (profileImage: string, id: string) => {
			const docRef = doc(colRefRegistration, id);

			await updateDoc(docRef, {
				profileImage: profileImage,
			});
		};

		deletingProfile = async () => {
			const user = auth.currentUser;
			await deleteUser(user);
		};

		deletingRegistrationInfo = async (id: string) => {
			const docRef = doc(colRefRegistration, id);
			await deleteDoc(docRef);
		};
	}
	const RS = new RegistrationSystem();
	const signingUp = RS.signingUp;
	const updatingThemeColor = RS.updatingThemeColor;
	const updatingBannerImage = RS.updatingBannerImage;
	const updatingBannerSize = RS.updatingBannerSize;
	const updatingUsername = RS.updatingUsername;
	const signingIn = RS.signingIn;
	const signingOut = RS.signingOut;
	const forgotPassword = RS.forgotPassword;
	const googleProvider = RS.googleProvider;
	const facebookProvider = RS.facebookProvider;
	const twitterProvider = RS.twitterProvider;
	const updatingUserEmail = RS.updatingUserEmail;
	const updatingProfileImage = RS.updatingProfileImage;
	const deletingProfile = RS.deletingProfile;
	const deletingRegistrationInfo = RS.deletingRegistrationInfo;

	class FolderSystem {
		constructor() {}

		addingFolder = async (folderName: string) => {
			await addDoc(colRefFolders, {
				folderName: folderName,
				userID: auth.currentUser?.uid,
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

		updatingCreatedTime = async (id: string) => {
			const docRef = doc(colRefFolders, id);
			await updateDoc(docRef, {
				createdTime: serverTimestamp(),
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
	const updatingCreatedTime = FS.updatingCreatedTime;

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
				folderDescription: folderDescription || "No Description",
				folderName: folderName,
				completed: false,
				userID: auth.currentUser?.uid,
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

		updatingFolderName = async (id: string, folderName: string) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				folderName: folderName,
			});
		};

		updatingFolderEmoji = async (id: string, folderEmoji: string) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				folderEmoji: folderEmoji,
			});
		};

		updatingFolderDescription = async (
			id: string,
			folderDescription: string
		) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				folderDescription: folderDescription,
			});
		};

		deletingTodoFolder = async (id: string) => {
			const docRef = doc(colRefTodoFolders, id);
			await deleteDoc(docRef);
		};

		updatingPin = async (id: string, pin: string) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				pin: pin,
			});
		};

		removePin = async (id: string) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				pin: "",
			});
		};

		hideFolder = async (id: string, folderHidden: boolean) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				folderHidden: folderHidden,
			});
		};

		updatingClickTimeStamp = async (id: string, clickTimeStamp: Timestamp) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				createdTime: clickTimeStamp,
			});
		};

		updatingPinnedIndicator = async (id: string, pinned: boolean) => {
			const docRef = doc(colRefTodoFolders, id);
			await updateDoc(docRef, {
				pinned: pinned || false,
			});
		};
	}
	const TLFS = new TodolistFolderSystem();
	const addingTodoFolder = TLFS.addingTodoFolder;
	const deletingTodoFolder = TLFS.deletingTodoFolder;
	const updatingCompletion = TLFS.updatingCompletion;
	const updatingFolderName = TLFS.updatingFolderName;
	const updatingFolderTitle = TLFS.updatingFolderTitle;
	const updatingFolderEmoji = TLFS.updatingFolderEmoji;
	const updatingFolderDescription = TLFS.updatingFolderDescription;
	const updatingPin = TLFS.updatingPin;
	const removePin = TLFS.removePin;
	const hideFolder = TLFS.hideFolder;
	const updatingClickTimeStamp = TLFS.updatingClickTimeStamp;
	const updatingPinnedIndicator = TLFS.updatingPinnedIndicator;

	class TodoListSystem {
		constructor() {}

		addingTodos = async (folderID: string, mainFolder: string) => {
			await addDoc(colRefTodoLists, {
				todo: "Untitled To-do Text",
				mainFolder,
				folderID: folderID,
				favorited: false,
				completed: false,
				userID: auth.currentUser?.uid,
				ignoreTodo: false,
				createdTime: serverTimestamp(),
			});
		};

		addingTodosGemini = async (
			folderID: string,
			mainFolder: string,
			todo: string,
			difficulty: string,
			ignoreTodo: boolean
		) => {
			try {
				await addDoc(colRefTodoLists, {
					todo: todo,
					mainFolder,
					folderID: folderID,
					favorited: false,
					completed: false,
					ignoreTodo: ignoreTodo,
					difficulty: difficulty,
					userID: auth.currentUser?.uid,
					createdTime: serverTimestamp(),
				});
			} catch (err) {
				console.log(err);
			}
		};

		addingSubTodosGemini = async (
			todo: string,
			todoID: string,
			folderID: string,
			mainFolder: string
		) => {
			try {
				await addDoc(colRefSubTodoLists, {
					todo: todo,
					todoID: todoID,
					folderID: folderID,
					mainFolder: mainFolder || [],
					favorited: false,
					completed: false,
					userID: auth.currentUser?.uid,
					createdTime: serverTimestamp(),
				});
			} catch (err) {
				console.log(err);
			}
		};

		updatingTodolist = async (id: string, todo: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);
			await updateDoc(docRef, {
				todo: todo,
				createdTime: serverTimestamp(),
			});
		};

		updatingTodolistFavorite = async (id: string, favorited: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);
			await updateDoc(docRef, {
				favorited: favorited,
			});
		};

		updatingTodolistCompleted = async (id: string, completed: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);
			await updateDoc(docRef, {
				completed: completed,
			});
		};

		deletingTodolist = async (id: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);
			await deleteDoc(docRef);
		};

		addSubTodo = async (
			mainFolder: string,
			folderID: string,
			todoID: string
		) => {
			try {
				await addDoc(colRefSubTodoLists, {
					todo: "Untitled Sub Todo",
					favorited: false,
					completed: false,
					mainFolder,
					folderID: folderID,
					todoID: todoID,
					userID: auth.currentUser?.uid,
					createdTime: serverTimestamp(),
				});
			} catch (err) {
				console.log(`Sub To-do Error | ${err.message}`);
			}
		};

		updatingSubTodoCompleted = async (id: string, completed: boolean) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await updateDoc(docRef, {
				completed: completed,
			});
		};

		updatingSubTodoEdit = async (id: string, todo: boolean) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await updateDoc(docRef, {
				todo: todo,
			});
		};

		updatingSubTodoFavorite = async (id: string, favorited: boolean) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await updateDoc(docRef, {
				favorited: favorited,
			});
		};

		deletingSubTodo = async (id: string) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await deleteDoc(docRef);
		};

		updatingTodoDifficulty = async (id: string, difficulty: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				difficulty: difficulty || "",
			});
		};

		updatingTodoMainFolder = async (id: string, mainFolder: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				mainFolder,
			});
		};

		updatingSubTodoMainFolder = async (id: string, mainFolder: string) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await updateDoc(docRef, {
				mainFolder,
			});
		};

		updatingIgnoreTodo = async (id: string, ignoreTodo: boolean) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				ignoreTodo: ignoreTodo,
			});
		};

		updatingMarkAsImportant = async (id: string, markImportant: boolean) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				markImportant: markImportant,
			});
		};

		updatingTodoCompletionDates = async (
			id: string,
			startDate: any,
			endDate: any
		) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				startDate: startDate,
				endDate: endDate,
			});
		};

		updatingDeletionIndicator = async (
			id: string,
			deletionIndicator: boolean
		) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				deletionIndicator: deletionIndicator,
			});
		};

		updatingSubTodoDeletionIndicator = async (
			id: string,
			deletionIndicator: boolean
		) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await updateDoc(docRef, {
				deletionIndicator: deletionIndicator,
			});
		};
	}

	const TLS = new TodoListSystem();
	const addingTodos = TLS.addingTodos;
	const updatingTodolist = TLS.updatingTodolist;
	const updatingTodolistFavorite = TLS.updatingTodolistFavorite;
	const updatingTodolistCompleted = TLS.updatingTodolistCompleted;
	const deletingTodolist = TLS.deletingTodolist;
	const addSubTodo = TLS.addSubTodo;
	const updatingSubTodoCompleted = TLS.updatingSubTodoCompleted;
	const updatingSubTodoEdit = TLS.updatingSubTodoEdit;
	const updatingSubTodoFavorite = TLS.updatingSubTodoFavorite;
	const deletingSubTodo = TLS.deletingSubTodo;
	const updatingTodoDifficulty = TLS.updatingTodoDifficulty;
	const updatingTodoMainFolder = TLS.updatingTodoMainFolder;
	const updatingSubTodoMainFolder = TLS.updatingSubTodoMainFolder;
	const updatingIgnoreTodo = TLS.updatingIgnoreTodo;
	const updatingMarkAsImportant = TLS.updatingMarkAsImportant;
	const updatingTodoCompletionDates = TLS.updatingTodoCompletionDates;
	const updatingDeletionIndicator = TLS.updatingDeletionIndicator;
	const updatingSubTodoDeletionIndicator = TLS.updatingSubTodoDeletionIndicator;
	const addingTodosGemini = TLS.addingTodosGemini;
	const addingSubTodosGemini = TLS.addingSubTodosGemini;

	class PersonalURLsSystem {
		constructor() {}

		addURL = async (url: string, title: string) => {
			addDoc(colRefPersonalURLs, {
				url: url,
				title: title,
				uid: auth.currentUser.uid,
				createdTime: serverTimestamp(),
			});
		};

		deleteURL = async (id: string) => {
			const docRef = doc(colRefPersonalURLs, id);
			await deleteDoc(docRef);
		};
	}
	const PURLsS = new PersonalURLsSystem();
	const addURL = PURLsS.addURL;
	const deleteURL = PURLsS.deleteURL;

	class SharingTodoFolderSystem {
		constructor() {}

		shareTodoFolder = async (
			receiverAccountID: string,
			senderTodoFolderID: string,
			folderEmoji: string,
			folderTitle: string,
			folderDescription: string
		) => {
			await addDoc(colRefTodoFolders, {
				folderEmoji: folderEmoji || "",
				folderTitle: folderTitle,
				folderDescription: folderDescription || "No Description",
				completed: false,
				senderTodoFolderID: senderTodoFolderID,
				userID: receiverAccountID,
				senderUID: auth.currentUser?.uid,
				createdTime: serverTimestamp(),
			});
		};

		shareTodos = async (
			receiverAccountID: string,
			senderFolderID: string,
			todo: string,
			favorited: boolean,
			completed: boolean,
			ignoreTodo: boolean,
			difficulty: string,
			endDate: any,
			startDate: any,
			markImportant: boolean,
			senderTodoID: string
		) => {
			await addDoc(colRefTodoLists, {
				todo: todo,
				favorited: favorited,
				completed: completed,
				ignoreTodo: ignoreTodo,
				difficulty: difficulty || "",
				startDate: startDate || "",
				endDate: endDate || "",
				markImportant: markImportant || false,
				deletionIndicator: false,
				senderTodoID: senderTodoID,
				folderID: senderFolderID,
				userID: receiverAccountID,
				senderUID: auth.currentUser?.uid,
				createdTime: serverTimestamp(),
			});
		};

		shareSubTodos = async (
			receiverAccountID: string,
			senderFolderID: string,
			todo: string,
			favorited: boolean,
			completed: boolean,
			todoID: string
		) => {
			await addDoc(colRefSubTodoLists, {
				todo: todo,
				favorited: favorited,
				completed: completed,
				deletionIndicator: false,
				todoID: todoID,
				folderID: senderFolderID,
				userID: receiverAccountID,
				senderUID: auth.currentUser?.uid,
				createdTime: serverTimestamp(),
			});
		};

		addingSharedTodos = async (
			folderID: string,
			mainFolder: string,
			senderTodoFolderID: string
		) => {
			await addDoc(colRefTodoLists, {
				todo: "Untitled To-do Text",
				mainFolder,
				favorited: false,
				completed: false,
				ignoreTodo: false,
				userID: auth.currentUser?.uid,
				folderID: folderID,
				senderTodoFolderID: senderTodoFolderID,
				createdTime: serverTimestamp(),
			});
		};

		addingSharedSubTodo = async (
			mainFolder: string,
			folderID: string,
			todoID: string,
			senderTodoFolderID: string
		) => {
			try {
				await addDoc(colRefSubTodoLists, {
					todo: "Untitled Sub Todo",
					favorited: false,
					completed: false,
					mainFolder,
					folderID: folderID,
					todoID: todoID,
					senderTodoFolderID: senderTodoFolderID,
					userID: auth.currentUser?.uid,
					createdTime: serverTimestamp(),
				});
			} catch (err) {
				console.log(`Sub To-do Error | ${err.message}`);
			}
		};

		addingSharedTodosGemini = async (
			folderID: string,
			todo: string,
			difficulty: string,
			ignoreTodo: boolean,
			senderTodoFolderID: string
		) => {
			try {
				await addDoc(colRefTodoLists, {
					todo: todo,
					favorited: false,
					completed: false,
					ignoreTodo: ignoreTodo,
					difficulty: difficulty,
					folderID: folderID,
					senderTodoFolderID: senderTodoFolderID,
					userID: auth.currentUser?.uid,
					createdTime: serverTimestamp(),
				});
			} catch (err) {
				console.log(err);
			}
		};

		addingSharedSubTodosGemini = async (
			todo: string,
			todoID: string,
			folderID: string,
			senderTodoFolderID: string
		) => {
			try {
				await addDoc(colRefSubTodoLists, {
					todo: todo,
					favorited: false,
					completed: false,
					todoID: todoID,
					folderID: folderID,
					senderTodoFolderID: senderTodoFolderID,
					userID: auth.currentUser?.uid,
					createdTime: serverTimestamp(),
				});
			} catch (err) {
				console.log(err);
			}
		};

		updatingSharedTodolist = async (id: string, todo: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);
			await updateDoc(docRef, {
				todo: todo,
				createdTime: serverTimestamp(),
			});
		};

		updatingSharedTodolistFavorite = async (id: string, favorited: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);
			await updateDoc(docRef, {
				favorited: favorited,
			});
		};

		updatingSharedTodolistCompleted = async (id: string, completed: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);
			await updateDoc(docRef, {
				completed: completed,
			});
		};

		deletingSharedTodolist = async (id: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);
			await deleteDoc(docRef);
		};

		updatingSharedSubTodoCompleted = async (id: string, completed: boolean) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await updateDoc(docRef, {
				completed: completed,
			});
		};

		updatingSharedSubTodoEdit = async (id: string, todo: boolean) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await updateDoc(docRef, {
				todo: todo,
			});
		};

		updatingSharedSubTodoFavorite = async (id: string, favorited: boolean) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await updateDoc(docRef, {
				favorited: favorited,
			});
		};

		deletingSharedSubTodo = async (id: string) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await deleteDoc(docRef);
		};

		updatingSharedTodoDifficulty = async (id: string, difficulty: string) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				difficulty: difficulty || "",
			});
		};

		updatingSharedIgnoreTodo = async (id: string, ignoreTodo: boolean) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				ignoreTodo: ignoreTodo,
			});
		};

		updatingSharedMarkAsImportant = async (
			id: string,
			markImportant: boolean
		) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				markImportant: markImportant,
			});
		};

		updatingSharedTodoCompletionDates = async (
			id: string,
			startDate: any,
			endDate: any
		) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				startDate: startDate,
				endDate: endDate,
			});
		};

		updatingSharedDeletionIndicator = async (
			id: string,
			deletionIndicator: boolean
		) => {
			const docRef: DocumentReference = doc(colRefTodoLists, id);

			await updateDoc(docRef, {
				deletionIndicator: deletionIndicator,
			});
		};

		updatingSharedSubTodoDeletionIndicator = async (
			id: string,
			deletionIndicator: boolean
		) => {
			const docRef: DocumentReference = doc(colRefSubTodoLists, id);

			await updateDoc(docRef, {
				deletionIndicator: deletionIndicator,
			});
		};
	}
	const STFS = new SharingTodoFolderSystem();
	const shareTodos = STFS.shareTodos;
	const shareTodoFolder = STFS.shareTodoFolder;
	const shareSubTodos = STFS.shareSubTodos;
	const addingSharedTodos = STFS.addingSharedTodos;
	const addingSharedSubTodo = STFS.addingSharedSubTodo;
	const addingSharedTodosGemini = STFS.addingSharedTodosGemini;
	const addingSharedSubTodosGemini = STFS.addingSharedSubTodosGemini;
	const updatingSharedTodolist = STFS.updatingSharedTodolist;
	const updatingSharedTodolistFavorite = STFS.updatingSharedTodolistFavorite;
	const updatingSharedTodolistCompleted = STFS.updatingSharedTodolistCompleted;
	const deletingSharedTodolist = STFS.deletingSharedTodolist;
	const updatingSharedSubTodoCompleted = STFS.updatingSharedSubTodoCompleted;
	const updatingSharedSubTodoEdit = STFS.updatingSharedSubTodoEdit;
	const updatingSharedSubTodoFavorite = STFS.updatingSharedSubTodoFavorite;
	const deletingSharedSubTodo = STFS.deletingSharedSubTodo;
	const updatingSharedTodoDifficulty = STFS.updatingSharedTodoDifficulty;
	const updatingSharedIgnoreTodo = STFS.updatingSharedIgnoreTodo;
	const updatingSharedMarkAsImportant = STFS.updatingSharedMarkAsImportant;
	const updatingSharedTodoCompletionDates =
		STFS.updatingSharedTodoCompletionDates;
	const updatingSharedDeletionIndicator = STFS.updatingSharedDeletionIndicator;
	const updatingSharedSubTodoDeletionIndicator =
		STFS.updatingSharedSubTodoDeletionIndicator;

	class SavedUsersUIDSystem {
		constructor() {}

		savingUserUID = async (username: string, accountUID: string) => {
			await addDoc(colRefSavedUsers, {
				username: username,
				blocked: false,
				accountUID: accountUID,
				uid: auth?.currentUser?.uid,
				createdTime: serverTimestamp(),
			});
		};

		deletingUserUID = async (id: string) => {
			const docRef = doc(colRefSavedUsers, id);
			await deleteDoc(docRef);
		};

		blockUser = async (blocked: boolean, id: string) => {
			const docRef: DocumentReference = doc(colRefSavedUsers, id);

			await updateDoc(docRef, {
				blocked: blocked,
			});
		};
	}
	const SUIDS = new SavedUsersUIDSystem();
	const savingUserUID = SUIDS.savingUserUID;
	const deletingUserUID = SUIDS.deletingUserUID;
	const blockUser = SUIDS.blockUser;

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
			updatingUsername,
			signingIn,
			signingOut,
			forgotPassword,
			googleProvider,
			facebookProvider,
			twitterProvider,
			updatingUserEmail,
			updatingProfileImage,
			deletingProfile,
			deletingRegistrationInfo,
		},

		folders: {
			allFolders,
			addingFolder,
			updatingCompletionFolder,
			updatingCreatedTime,
			deletingFolder,
		},

		todolistFolders: {
			updatingFolderDescription,
			updatingFolderName,
			updatingFolderTitle,
			updatingFolderEmoji,
			updatingCompletion,
			updatingClickTimeStamp,
			updatingPinnedIndicator,
			deletingTodoFolder,
			addingTodoFolder,
			allTodoFolders,
			updatingPin,
			removePin,
			hideFolder,
		},

		todoLists: {
			allTodoLists,
			addingTodos,
			updatingTodolist,
			deletingTodolist,
			updatingTodolistFavorite,
			updatingTodolistCompleted,
			allSubTodos,
			addSubTodo,
			updatingSubTodoCompleted,
			updatingSubTodoEdit,
			updatingSubTodoFavorite,
			deletingSubTodo,
			updatingTodoDifficulty,
			updatingTodoMainFolder,
			updatingSubTodoMainFolder,
			updatingIgnoreTodo,
			updatingMarkAsImportant,
			updatingTodoCompletionDates,
			updatingDeletionIndicator,
			updatingSubTodoDeletionIndicator,
			addingTodosGemini,
			addingSubTodosGemini,
		},

		personalURLsSystem: {
			allPersonalURLs,
			addURL,
			deleteURL,
		},

		sharingTodoFolder: {
			shareTodos,
			shareTodoFolder,
			shareSubTodos,
			addingSharedTodos,
			addingSharedSubTodo,
			addingSharedTodosGemini,
			addingSharedSubTodosGemini,
			updatingSharedTodolist,
			updatingSharedTodolistFavorite,
			updatingSharedTodolistCompleted,
			deletingSharedTodolist,
			updatingSharedSubTodoCompleted,
			updatingSharedSubTodoEdit,
			updatingSharedSubTodoFavorite,
			deletingSharedSubTodo,
			updatingSharedTodoDifficulty,
			updatingSharedIgnoreTodo,
			updatingSharedMarkAsImportant,
			updatingSharedTodoCompletionDates,
			updatingSharedDeletionIndicator,
			updatingSharedSubTodoDeletionIndicator,
		},

		savedUserUIDs: {
			allSavedUsers,
			savingUserUID,
			deletingUserUID,
			blockUser,
		},
	};
}
