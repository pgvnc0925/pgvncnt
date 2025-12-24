"use server";

import { cookies } from "next/headers";

// Cookie-based user progress tracking
const PROGRESS_COOKIE = "pv_progress";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

export interface UserProgress {
  viewedBooks: string[]; // Book slugs the user has viewed
  unlockedBooks: string[]; // Book slugs the user has unlocked (accessed audio/PDF)
  completedQuizzes: string[]; // Book slugs where user completed quiz
  viewedMaps: string[]; // Book slugs where user viewed mental map
}

/**
 * Get user progress from cookies
 */
export async function getUserProgress(): Promise<UserProgress> {
  const cookieStore = await cookies();
  const progressCookie = cookieStore.get(PROGRESS_COOKIE);

  if (!progressCookie?.value) {
    return {
      viewedBooks: [],
      unlockedBooks: [],
      completedQuizzes: [],
      viewedMaps: [],
    };
  }

  try {
    return JSON.parse(progressCookie.value) as UserProgress;
  } catch (error) {
    console.error("Error parsing progress cookie:", error);
    return {
      viewedBooks: [],
      unlockedBooks: [],
      completedQuizzes: [],
      viewedMaps: [],
    };
  }
}

/**
 * Save user progress to cookies
 */
async function saveUserProgress(progress: UserProgress): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(PROGRESS_COOKIE, JSON.stringify(progress), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

/**
 * Mark a book as viewed
 */
export async function markBookViewed(slug: string): Promise<void> {
  const progress = await getUserProgress();

  if (!progress.viewedBooks.includes(slug)) {
    progress.viewedBooks.push(slug);
    await saveUserProgress(progress);
  }
}

/**
 * Mark a book as unlocked (user accessed premium content)
 */
export async function markBookUnlocked(slug: string): Promise<void> {
  const progress = await getUserProgress();

  if (!progress.unlockedBooks.includes(slug)) {
    progress.unlockedBooks.push(slug);
    await saveUserProgress(progress);
  }
}

/**
 * Mark a quiz as completed
 */
export async function markQuizCompleted(slug: string): Promise<void> {
  const progress = await getUserProgress();

  if (!progress.completedQuizzes.includes(slug)) {
    progress.completedQuizzes.push(slug);
    await saveUserProgress(progress);
  }
}

/**
 * Mark a mental map as viewed
 */
export async function markMapViewed(slug: string): Promise<void> {
  const progress = await getUserProgress();

  if (!progress.viewedMaps.includes(slug)) {
    progress.viewedMaps.push(slug);
    await saveUserProgress(progress);
  }
}

/**
 * Get total books accessed (viewed or unlocked)
 */
export async function getTotalBooksAccessed(): Promise<number> {
  const progress = await getUserProgress();
  const allAccessed = new Set([
    ...progress.viewedBooks,
    ...progress.unlockedBooks,
  ]);
  return allAccessed.size;
}

/**
 * Get progress statistics
 */
export async function getProgressStats() {
  const progress = await getUserProgress();

  return {
    viewedCount: progress.viewedBooks.length,
    unlockedCount: progress.unlockedBooks.length,
    quizzesCompleted: progress.completedQuizzes.length,
    mapsViewed: progress.viewedMaps.length,
    totalAccessed: new Set([
      ...progress.viewedBooks,
      ...progress.unlockedBooks,
    ]).size,
  };
}
