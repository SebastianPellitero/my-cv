import type { Metadata } from "next";
import IntroGate from "@/components/intro/IntroGate";
import HomePage from "../page";

// Same content as "/", so keep it out of search results
export const metadata: Metadata = {
    title: "Intro",
    robots: { index: false },
};

// Plays the intro on every visit, over the real home page, then lands on "/"
export default function IntroPage() {
    return (
        <IntroGate alwaysShow finishHref="/">
            <HomePage />
        </IntroGate>
    );
}
