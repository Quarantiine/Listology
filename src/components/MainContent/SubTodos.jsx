import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import shortenUrl from "shorten-url";

export default function SubTodos({
	subTodo,
	todolist,
	user,
	todoLists,
	closeSubTodos,
}) {
	const [subTodoText, setSubTodoText] = useState("");
	const [editTextActive, setEditTextActive] = useState(false);
	const [openLinkDropdown, setOpenLinkDropdown] = useState(false);
	const editTextActiveRef = useRef();
	const linkPattern = /(https?:\/\/[^\s]+)/;

	useEffect(() => {
		const closeSubTodoTextEdit = (e) => {
			if (!e.target.closest(".input-todo-text")) {
				setEditTextActive(false);
			}
		};

		document.addEventListener("mousedown", closeSubTodoTextEdit);
		return () =>
			document.removeEventListener("mousedown", closeSubTodoTextEdit);
	}, [editTextActive]);

	const handleCompletedTodo = () => {
		todoLists.updatingSubTodoCompleted(subTodo.id, !subTodo.completed);
	};

	const handleEditTextActive = () => {
		setEditTextActive(!editTextActive);
		setTimeout(() => {
			editTextActiveRef.current?.focus();
		}, 10);
	};

	const handleChangeEditText = () => {
		if (subTodoText) {
			setEditTextActive(false);
			todoLists.updatingSubTodoEdit(subTodo.id, subTodoText);
		}
	};

	const handleKeyedChangeEditText = (e) => {
		if (e.key === "Enter") {
			handleChangeEditText();
		}
	};

	const handleFavorited = () => {
		todoLists.updatingSubTodoFavorite(subTodo.id, !subTodo.favorited);
	};

	const handleDeleteTodo = () => {
		todoLists.deletingSubTodo(subTodo.id);
	};

	function extractLink() {
		var pattern = /(https?:\/\/[^\s]+)/;
		var matches = subTodo.todo.match(pattern);
		if (matches && matches.length > 0) {
			return matches[0];
		}
		return null;
	}

	const handleLinkDropdown = () => {
		if (!subTodo.completed && !todolist.completed)
			setOpenLinkDropdown(!openLinkDropdown);
	};

	useEffect(() => {
		const closeLinkDropdown = (e) => {
			if (!e.target.closest(".link-dropdown")) {
				setOpenLinkDropdown(false);
			}
		};

		document.addEventListener("mousedown", closeLinkDropdown);
		return () => document.removeEventListener("mousedown", closeLinkDropdown);
	}, []);

	return (
		<>
			<div
				className={`flex justify-start items-center gap-5 rounded-lg w-[95%] ml-auto overflow-hidden ${
					subTodo.favorited
						? user.themeColor
							? "bg-[#292929]"
							: "bg-[#eee]"
						: ""
				} ${closeSubTodos ? "h-0" : "px-2 py-1"}`}
			>
				<button
					className="min-w-[18px] max-w-[18px]"
					onClick={handleCompletedTodo}
				>
					<Image
						className="w-auto h-[20px]"
						src={
							subTodo.completed || todolist.completed
								? "/icons/completed-todo.svg"
								: user.themeColor
								? "/icons/checkbox-empty-white.svg"
								: "/icons/checkbox-empty-black.svg"
						}
						alt=""
						width={25}
						height={25}
					/>
				</button>

				{editTextActive && !subTodo.completed ? (
					<div className="flex justify-start items-center gap-2 w-full">
						<textarea
							ref={editTextActiveRef}
							onChange={(e) => setSubTodoText(e.target.value)}
							onKeyDown={handleKeyedChangeEditText}
							className={`input-todo-text border-none w-full rounded-md px-3 py-2 h-[40px] ${
								user.themeColor
									? "text-white bg-[#333]"
									: "text-black bg-gray-200"
							}`}
							// onChange={(e) => setEditFolderTitle(e.target.value)}
							type="text"
							placeholder={subTodo.todo}
						/>
						<div className="input-todo-text flex flex-col sm:flex-row justify-center items-center gap-2">
							<button onClick={handleChangeEditText} className="base-btn">
								change
							</button>
							<button
								onClick={handleEditTextActive}
								className="base-btn !bg-red-500"
							>
								cancel
							</button>
						</div>
					</div>
				) : linkPattern.test(subTodo.todo) ? (
					<>
						<button
							onClick={handleLinkDropdown}
							title={"Go to link"}
							className={`text-btn w-full text-start underline line-clamp-1 ${
								subTodo.completed || todolist.completed
									? "line-through select-all"
									: ""
							}`}
						>
							{subTodo.todo.replace(extractLink(), "")}
							{shortenUrl(extractLink(), 0)}
						</button>
						{openLinkDropdown && (
							<div
								className={`link-dropdown absolute top-1/2 -translate-y-1/2 left-0 w-fit h-fit px-3 py-1 rounded-md border z-10 flex flex-col justify-center items-start gap-1 bg-[#0E51FF] text-white`}
							>
								<Link
									href={extractLink()}
									target="_blank"
									onClick={() => {
										handleLinkDropdown();
									}}
									className={`text-btn w-full flex flex-col justify-center items-start gap-1 ${
										subTodo.completed || todolist.completed
											? "line-through select-all"
											: ""
									}`}
								>
									<span>Link</span>
								</Link>
								<button
									onClick={handleEditTextActive}
									className={`text-btn w-full flex flex-col justify-center items-start gap-1 ${
										subTodo.completed || todolist.completed
											? "line-through select-all"
											: ""
									}`}
								>
									<span>Edit</span>
								</button>
							</div>
						)}
					</>
				) : (
					<p
						onClick={handleEditTextActive}
						className={`text-btn w-full ${
							subTodo.completed || todolist.completed
								? "line-through select-all"
								: ""
						}`}
					>
						{subTodo.todo}
					</p>
				)}
				<div className="flex w-20 justify-end items-center gap-3 ml-auto">
					<>
						{subTodo.favorited ? (
							<button className="min-w-[20px] text-btn relative right-[1px] flex justify-center items-center">
								<Image
									onClick={handleFavorited}
									className="w-auto h-[20px] text-btn"
									src={
										user.themeColor
											? "/icons/favorite-white.svg"
											: "/icons/favorite-black.svg"
									}
									alt="favorite"
									width={25}
									height={25}
								/>
							</button>
						) : (
							<button
								className="text-btn flex justify-center items-center"
								onClick={handleFavorited}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									height="23"
									viewBox="0 96 960 960"
									width="23"
									fill={user.themeColor ? "white" : "black"}
								>
									<path d="m480 935-41-37q-105.768-97.121-174.884-167.561Q195 660 154 604.5T96.5 504Q80 459 80 413q0-90.155 60.5-150.577Q201 202 290 202q57 0 105.5 27t84.5 78q42-54 89-79.5T670 202q89 0 149.5 60.423Q880 322.845 880 413q0 46-16.5 91T806 604.5Q765 660 695.884 730.439 626.768 800.879 521 898l-41 37Zm0-79q101.236-92.995 166.618-159.498Q712 630 750.5 580t54-89.135q15.5-39.136 15.5-77.72Q820 347 778 304.5T670.225 262q-51.524 0-95.375 31.5Q531 325 504 382h-49q-26-56-69.85-88-43.851-32-95.375-32Q224 262 182 304.5t-42 108.816Q140 452 155.5 491.5t54 90Q248 632 314 698t166 158Zm0-297Z" />
								</svg>
							</button>
						)}
					</>
					<Image
						onClick={handleDeleteTodo}
						className="w-auto h-[18px] text-btn"
						src={"/icons/trash.svg"}
						alt="delete todos"
						width={20}
						height={20}
					/>
				</div>
			</div>
		</>
	);
}
