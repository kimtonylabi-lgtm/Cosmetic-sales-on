"use client";

import Link from "next/link";

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity">
                    COSMETIC-SALES ON
                </Link>
                <nav>
                    <Link
                        href="/login"
                        className="text-sm font-medium hover:opacity-70 transition-opacity flex items-center gap-1"
                    >
                        LOGIN <span className="text-[10px] mt-0.5">&gt;</span>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
