import { NextRequest, NextResponse } from 'next/server';
let _clientPromise: Promise<any> | null = null;
async function getClient() {
  if (!_clientPromise) { _clientPromise = (async () => { const { default: OpenAI } = await import('openai'); return new OpenAI({ apiKey: process.env.OPENAI_API_KEY, baseURL: 'https://api.deepseek.com/v1' }); })(); }
  return _clientPromise;
}
export async function POST(req: NextRequest) {
  try {
    const { research_question, key_papers, exclusion_criteria } = await req.json();
    const client = await getClient();
    const completion = await client.chat.completions.create({ model: 'deepseek-chat', messages: [{ role: 'user', content: `You are a systematic literature review expert. Conduct a comprehensive, structured literature review based on the following parameters.

Research Question: ${research_question}
Key Papers / Initial Literature: ${key_papers}
Exclusion Criteria: ${exclusion_criteria}

Provide:
1. Refined search strategy with key MeSH terms, keywords, and boolean logic
2. Suggested databases to search (PubMed, Scopus, Web of Science, Cochrane, Embase, etc.)
3. PRISMA flow diagram with estimated numbers at each screening stage
4. Thematic synthesis: organize findings into 3-5 major themes with subthemes
5. For each theme: summary of key findings, consistency across studies, notable disagreements
6. Quantitative synthesis: forest plot guidance for meta-analysis if appropriate
7. Quality assessment framework (ROBIS, GRADE, Newcastle-Ottawa Scale)
8. Gap analysis: what is NOT known, unanswered questions, future research directions
9. Conclusion: synthesized answer to the research question
10. Citation recommendations in APA 7 format for key foundational papers

Follow PRISMA 2020 guidelines and Cochrane Handbook standards.` }] });
    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) { return NextResponse.json({ error: err.message }, { status: 500 }); }
}