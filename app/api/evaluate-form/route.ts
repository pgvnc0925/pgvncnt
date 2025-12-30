import { NextResponse } from "next/server";
import { calculateScores, defaultDefinitionMatrix, getRecommendedBooks } from "@/data/evaluation/scoring";
import { defaultBookCatalog } from "@/data/evaluation/book-catalog";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const answers = body?.answers || {};

    const scores = calculateScores(answers, defaultDefinitionMatrix);
    const recommendedBooks = getRecommendedBooks(scores, defaultBookCatalog);

    return NextResponse.json({
      scoreLivello: scores.liv,
      scoreDominio: scores.dom,
      primaryDominio: scores.primaryDomain,
      secondaryDominio: scores.secondaryDomain,
      scoreInteresse: scores.int,
      primaryInteresse: scores.primaryInterest,
      maturity: scores.maturity,
      recommendedBooks,
    });
  } catch (err) {
    console.error("evaluate-form error", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
