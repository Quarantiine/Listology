import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import FirebaseApi from "../pages/api/firebaseApi";
import { useRouter } from "next/router";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

export const StateCtx = createContext();

export default function Layout({ children }) {
	const { auth } = FirebaseApi();
	const router = useRouter();
	const [themeColor, setThemeColor] = useState(true);
	const [closeSidebar, setCloseSidebar] = useState(false);
	const [bannerImage, setBannerImage] = useState("");
	const [clickedImageLoading, setClickedImageLoading] = useState(false);
	const [startX, setStartX] = useState(null);
	const [endX, setEndX] = useState(null);
	const [increaseBannerSize, setIncreaseBannerSize] = useState(true);
	const [openFolderModal, setOpenFolderModal] = useState(false);
	const [openTodolistSidebar, setOpenTodolistSidebar] = useState(false);
	const [clickedFolder, setClickedFolder] = useState("");
	const [clickedTodoFolder, setClickedTodoFolder] = useState("");

	function handleTouchStart(e) {
		setStartX(e.touches[0].clientX);
	}

	function handleTouchMove(e) {
		setEndX(e.touches[0].clientX);
	}

	function handleTouchEnd() {
		if (endX && startX && endX - startX > 50) {
			console.log("swiped right");
			setCloseSidebar(false);
			setOpenTodolistSidebar(false);
		} else if (endX && startX && startX - endX > 50) {
			console.log("swiped left");
			setCloseSidebar(true);
		}

		setStartX(null);
		setEndX(null);
	}

	const queryClient = new QueryClient();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				router.push("/");
			} else {
				router.push("/registration");
			}
		});
	}, []);

	useEffect(() => {
		const mobileSidebar = () => {
			if (window.innerWidth < 768) {
				setCloseSidebar(true);
			} else {
				setCloseSidebar(false);
			}
		};

		window.addEventListener("resize", mobileSidebar);
		return () => window.removeEventListener("resize", mobileSidebar);
	}, []);

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="/icons/logo-2.svg" type="image/x-icon" />
			</Head>

			<QueryClientProvider client={queryClient}>
				<StateCtx.Provider
					value={{
						bannerImage,
						setBannerImage,
						themeColor,
						setThemeColor,
						closeSidebar,
						setCloseSidebar,
						clickedImageLoading,
						setClickedImageLoading,
						increaseBannerSize,
						setIncreaseBannerSize,
						openFolderModal,
						setOpenFolderModal,
						openTodolistSidebar,
						setOpenTodolistSidebar,
						clickedFolder,
						setClickedFolder,
						clickedTodoFolder,
						setClickedTodoFolder,
					}}
				>
					<div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
						{children}
					</div>
				</StateCtx.Provider>
			</QueryClientProvider>
		</>
	);
}
