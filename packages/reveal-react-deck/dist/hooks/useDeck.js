import { create } from "zustand";
const useDeckStore = create((set, get) => ({
    setDeck: (newdeck) => {
        if (window.localStorage.getItem("isOverview") === "true" &&
            !newdeck.isOverview()) {
            newdeck.toggleOverview();
        }
        set({
            deck: newdeck,
            totalNumberOfSlides: newdeck.getTotalSlides(),
            currentSlide: 0,
            motion: window.localStorage.getItem("motion") !== "false",
        });
    },
    setCurrentSlide: (newSlide, id) => {
        set(() => ({ currentSlide: newSlide, currentSlideId: id }));
    },
    getCurrentSlide: () => get().currentSlide,
    setFragmentCurrentSlide: (newFragment) => {
        set((state) => {
            const currentSlide = state.currentSlide;
            const currentFragment = [...state.currentFragment];
            currentFragment[currentSlide] = newFragment;
            return { currentFragment };
        });
    },
    getFragmentCurrentSlide: () => {
        const currentSlide = get().currentSlide;
        return get().currentFragment[currentSlide];
    },
    toggleMotion: () => {
        set((state) => ({ motion: !state.motion }));
        // set local storage
        window.localStorage.setItem("motion", get().motion ? "true" : "false");
        // Display toast
        let toast = document.getElementById("motion-toast");
        if (!toast) {
            toast = document.createElement("div");
            toast.id = "motion-toast";
            toast.classList.add(..."absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black opacity-50 text-white px-4 py-2 rounded z-50".split(" "));
            document.body.appendChild(toast);
        }
        toast.textContent = `Motion ${get().motion ? "enabled" : "disabled"}`;
        toast.style.display = "block";
        setTimeout(() => {
            if (toast)
                document.body.removeChild(toast);
        }, 2000);
    },
    onFragment: (index, only = false) => {
        if (only) {
            return get().currentFragment[get().currentSlide] === index ? true : false;
        }
        return get().currentFragment[get().currentSlide] >= index ? true : false;
    },
    onFragmentAnimate: () => {
        const fragment = get().currentFragment[get().currentSlide];
        const defaultProps = { scale: [0, 1], opacity: [0, 1] };
        const defaultFallbackProps = { scale: 1, opacity: 0 };
        return function (index, props, fallbackProps, only = false) {
            if (only) {
                return fragment == index
                    ? props || defaultProps
                    : fallbackProps || defaultFallbackProps;
            }
            return fragment >= index
                ? props || defaultProps
                : fallbackProps || defaultFallbackProps;
        };
    },
    // default values
    deck: null,
    totalNumberOfSlides: -1,
    currentSlide: -1,
    currentSlideId: "",
    isOverview: false,
    currentFragment: [],
    fragmentOfSlide: {},
    fragment: 0,
    motion: true,
}));
export { useDeckStore };
