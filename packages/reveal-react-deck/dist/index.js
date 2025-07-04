import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useDeckStore } from "./hooks/useDeck.js";
import { useCallback, useEffect, useRef } from "react";
import { MDXProvider } from "@mdx-js/react";
import Reveal from "reveal.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm";
import mdxComponents from "./components/index.js";
const Slides = ({ slides }) => {
    useEffect(() => {
        const reveal = useDeckStore.getState().deck;
        if (reveal) {
            const { indexh, indexf } = reveal.getState();
            reveal.sync();
            reveal.slide(indexh, 0, indexf);
        }
    }, [slides]);
    return (_jsx(_Fragment, { children: slides.map((SlideContent, index) => {
            if (SlideContent.frontmatter.hidden)
                return null;
            return _jsx(SlideContent.default, {}, index);
        }) }));
};
function RevealSlides({ slides, options, revealOptions, plugins = [RevealHighlight], }) {
    const deckDivRef = useRef(null);
    useReveal({
        options: revealOptions,
        deckDivRef,
        plugins,
    });
    return (_jsx("div", { className: "reveal", ref: deckDivRef, children: _jsx(MDXProvider, { components: mdxComponents(options || {}), children: _jsx("div", { className: "slides", children: _jsx(Slides, { slides: slides }) }) }) }));
}
const useReveal = ({ options, deckDivRef, plugins, }) => {
    const deck = useDeckStore((state) => state.deck);
    useEffect(() => {
        if (deck)
            return;
        if (!deckDivRef.current)
            return;
        const newdeck = new Reveal(deckDivRef.current, {
            ...options,
        });
        newdeck
            .initialize({
            plugins,
        })
            .then(() => {
            useDeckStore.setState({ deck: newdeck });
            newdeck.on("overviewshown", () => {
                useDeckStore.setState({ isOverview: true });
                window.localStorage.setItem("isOverview", "true");
            });
            newdeck.on("overviewhidden", () => {
                useDeckStore.setState({ isOverview: false });
                window.localStorage.setItem("isOverview", "false");
            });
            newdeck.on("slidechanged", (_event) => {
                const event = _event;
                useDeckStore.getState().setCurrentSlide(event.indexh, event.currentSlide.id);
            });
            newdeck.on("fragmentshown", (_event) => {
                const event = _event;
                let fragmentIndex = parseInt(event.fragment.dataset.fragmentIndex);
                useDeckStore.getState().setFragmentCurrentSlide(fragmentIndex + 1);
            });
            newdeck.on("fragmenthidden", (_event) => {
                const event = _event;
                let fragmentIndex = parseInt(event.fragment.dataset.fragmentIndex);
                useDeckStore.getState().setFragmentCurrentSlide(fragmentIndex);
            });
        });
        return () => {
            try {
                if (newdeck) {
                    newdeck.destroy();
                }
            }
            catch (e) {
                console.warn("Reveal.js destroy call failed");
            }
        };
    }, []);
    const handleKeyPress = useCallback((event) => {
        if (event.key === "B") {
            deckDivRef.current
                ?.querySelector(".slides")
                .classList.toggle("slides-border");
        }
    }, []);
    useEffect(() => {
        if (typeof window !== "undefined" && document) {
            // attach the event listener
            document.addEventListener("keydown", handleKeyPress);
            // remove the event listener
            return () => {
                document.removeEventListener("keydown", handleKeyPress);
            };
        }
    }, [handleKeyPress]);
};
export default RevealSlides;
