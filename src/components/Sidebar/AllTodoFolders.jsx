import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import FirebaseApi from "../../pages/api/firebaseApi";
import { StateCtx } from "../Layout";

export default function AllTodoFolders({
	todolistFolders,
	todoFolder,
	user,
	index,
	setClickedTodoFolder,
	todoFolderDeletionRef,
	handleDeletionIndicator,
	pin,
}) {
	const { auth, todoLists, folders } = FirebaseApi();
	const {
		clickedTodoFolder,
		clickedFolder,
		setOpenTodolistSidebar,
		setCloseSidebar,
		filterDispatch,
	} = useContext(StateCtx);
	const [todoFolderCompleteIndicator, setTodoFolderCompleteIndicator] =
		useState(false);
	const [deletionWarning, setDeletionWarning] = useState(false);
	const todoFolderCompleteRef = useRef();

	useEffect(() => {
		const closeTodoFoldersModal = (e) => {
			if (!e.target.closest(".todo-folders-deletion-warning")) {
				setDeletionWarning(false);
			}
		};

		document.addEventListener("mousedown", closeTodoFoldersModal);
		return () =>
			document.removeEventListener("mousedown", closeTodoFoldersModal);
	}, [deletionWarning]);

	const handleCompletionIndicator = () => {
		if (!todoFolder.completed) {
			setTodoFolderCompleteIndicator(true);
			todoFolderCompleteRef.current = setTimeout(() => {
				setTodoFolderCompleteIndicator(false);
			}, 2000);
		} else {
			setTodoFolderCompleteIndicator(false);
		}
	};

	const handleCompletion = () => {
		clearTimeout(todoFolderCompleteRef.current);
		todolistFolders.updatingCompletion(todoFolder.id, !todoFolder.completed);
	};

	const handleDeletion = () => {
		todolistFolders.deletingTodoFolder(todoFolder.id);

		todoLists.allTodoLists
			.filter(
				(value) =>
					(value.folderID === todoFolder.id ||
						value.folderID === todoFolder.senderTodoFolderID) &&
					auth.currentUser?.uid === value.userID
			)
			?.map((todoList) => todoLists.deletingTodolist(todoList.id));

		todoLists.allSubTodos
			.filter(
				(value) =>
					(value.folderID === todoFolder.id ||
						value.folderID === todoFolder.senderTodoFolderID) &&
					auth.currentUser?.uid === value.userID
			)
			?.map((subTodo) => todoLists.deletingSubTodo(subTodo.id));

		setClickedTodoFolder("");
		clearTimeout(todoFolderDeletionRef.current);
	};

	const timeStamp = () => {
		let date = new Date();
		return date;
	};

	const handleClickedTodoFolder = () => {
		todolistFolders.updatingClickTimeStamp(todoFolder.id, timeStamp());
		setClickedTodoFolder(todoFolder.id);
		setOpenTodolistSidebar(false);

		folders.allFolders
			.filter(
				(value) =>
					value.folderName === todoFolder.folderName &&
					auth.currentUser?.uid === value.userID
			)
			.map((folder) => folders.updatingCreatedTime(folder.id));

		filterDispatch({
			type: "filter-category",
			payload: {
				key: "filterCategories",
				value: "All",
				value2: "",
			},
		});

		const mobileSidebar = () => {
			if (window.innerWidth < 1024) {
				setCloseSidebar(true);
			} else {
				setCloseSidebar(false);
			}
		};
		mobileSidebar();
	};

	const handleDeletingWarning = () => {
		setDeletionWarning(!deletionWarning);
	};

	return (
		<>
			<div
				className={`flex justify-between items-center gap-2 p-1 rounded-md w-full ${
					clickedTodoFolder === todoFolder.id &&
					folders.allFolders
						?.filter(
							(value) =>
								value.folderName === clickedFolder &&
								value.userID === auth.currentUser?.uid
						)
						.slice(0, 1)
						?.map((folder) => folder.folderName)
						? user.themeColor
							? "bg-[#444]"
							: "bg-[#eee]"
						: ""
				}`}
			>
				{todoFolderCompleteIndicator &&
					createPortal(
						<>
							<div className="fixed top-0 left-0 w-full h-fit py-3 flex justify-center items-center text-white bg-green-500 z-50">
								<p>Completed To-do Folder: {todoFolder.folderTitle}</p>
							</div>
						</>,
						document.body
					)}

				<p
					className={`text-sm ${
						user.themeColor ? "text-[#888]" : "text-gray-400"
					}`}
				>
					{index + 1}
				</p>

				<button
					onClick={!pin ? handleClickedTodoFolder : null}
					className={`flex justify-start items-center gap-1 w-full text-start ${
						pin && "cursor-not-allowed"
					}`}
				>
					{pin && (
						<Image
							className="w-auto min-h-[15px] max-h-[15px]"
							src={
								user.themeColor
									? "/icons/lock-white.svg"
									: "/icons/lock-black.svg"
							}
							alt="trash"
							width={25}
							height={25}
						/>
					)}
					<h1 className="line-clamp-1 w-32" title={todoFolder.folderTitle}>
						{todoFolder.folderTitle}
					</h1>
					<h1>
						{todoFolder.folderEmoji ? (
							todoFolder.folderEmoji
						) : (
							<>
								<div className="w-4 h-4 rounded-full bg-gray-400" />
							</>
						)}
					</h1>
				</button>

				<div className="flex justify-center items-center gap-2">
					<button
						onClick={() => {
							handleCompletion();
							handleCompletionIndicator();
						}}
					>
						<Image
							className="w-auto h-[18px]"
							src={
								todoFolder.completed
									? "/icons/completed-folder.svg"
									: user.themeColor
									? "/icons/checkbox-empty-white.svg"
									: "/icons/checkbox-empty-black.svg"
							}
							alt="completed"
							width={20}
							height={20}
						/>
					</button>
					<button
						onClick={() => {
							handleDeletingWarning();
						}}
					>
						<Image
							className="w-auto h-[18px]"
							src={"/icons/trash.svg"}
							alt="trash"
							width={20}
							height={20}
						/>
					</button>

					{deletionWarning && (
						<TodolistFolderWarningModal
							handleDeletion={handleDeletion}
							handleDeletionIndicator={handleDeletionIndicator}
							handleDeletingWarning={handleDeletingWarning}
							todoFolder={todoFolder}
						/>
					)}
				</div>
			</div>
		</>
	);
}

const TodolistFolderWarningModal = ({
	handleDeletion,
	handleDeletionIndicator,
	handleDeletingWarning,
	todoFolder,
}) => {
	return (
		<>
			<div className="z-50 text-black flex justify-center items-center fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.8)]">
				<div className="todo-folders-deletion-warning todolist-sidebar w-fit h-fit p-5 rounded-md bg-white text-center flex flex-col gap-3">
					<div className="flex flex-col justify-center items-center">
						<h1 className="text-2xl font-semibold">Deleting To-do Folder:</h1>
						<h1 className="text-lg font-light italic">
							{todoFolder.folderTitle}
						</h1>
					</div>
					<p>Are you sure you want to delete?</p>
					<div className="flex justify-center items-center gap-4">
						<button
							onClick={() => {
								handleDeletion();
								handleDeletionIndicator();
							}}
							className="base-btn !bg-red-500"
						>
							Delete
						</button>
						<button onClick={handleDeletingWarning} className="base-btn">
							Cancel
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
