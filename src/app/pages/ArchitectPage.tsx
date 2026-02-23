import { useCallback, useEffect, useRef, useState } from 'react';

type TerminalLine = {
  speaker: 'system' | 'user';
  text: string;
};

const TYPING_DELAY_MS = 22;
const LINE_PAUSE_MS = 600;
const MAX_ANSWER_LENGTH = 10;

const personaLine =
  'I\'m a Senior Fullstack Developer specializing in .NET and TypeScript. I care deeply about solid software architecture, clean delivery, and finding practical ways to use AI. I love learning, so I\'m currently diving deep into cybersecurity. Beyond the screen, I stay pretty active—I\'m a big fan of team sports, boxing, snowboarding, and surfing.';

const resumeIntroLines = [
  'Capital on Tap - Software Engineer: Modernized a legacy codebase and migrated critical monolith components to microservices to improve scalability and maintainability.',
  'Onwelo - Senior Fullstack Developer: Led architecture, technical direction, refactoring, quality practices, and cross-team collaboration in .NET/TypeScript cloud environments.',
  'Onwelo - Full Stack Software Developer: Acted as team and tech lead delivering .NET, GraphQL, SQL, and React solutions.',
  'Inwedo - Full Stack Developer: Built .NET and JavaScript/TypeScript systems with microservices, Azure cloud tooling, and mentoring support.',
  'Infosys BPM - Systems Engineer: Developed .NET/Python automation and web solutions, including integration, scraping, and testing workflows.',
  'Lumileds - Automotive Group Data Specialist: Maintained SAP data quality and ownership processes for business-critical areas.',
];

const yesVariants = new Set([
  'yes',
  'y',
  'yeah',
  'yep',
  'sure',
  'ok',
  'okay',
  'why not',
  'ofc',
  'sure'
]);

export default function ArchitectPage() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [awaitingInput, setAwaitingInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [submittedAnswer, setSubmittedAnswer] = useState<string | null>(null);

  const timeoutsRef = useRef<number[]>([]);
  const cancelledRef = useRef(false);
  const terminalOutputRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const wait = useCallback((delayMs: number) => {
    return new Promise<void>((resolve) => {
      const timeoutId = window.setTimeout(resolve, delayMs);
      timeoutsRef.current.push(timeoutId);
    });
  }, []);

  const appendSystemLine = useCallback(
    async (text: string) => {
      if (cancelledRef.current) {
        return;
      }

      setIsTyping(true);
      setLines((prev) => [...prev, { speaker: 'system', text: '' }]);

      for (const character of text) {
        if (cancelledRef.current) {
          return;
        }

        await wait(TYPING_DELAY_MS);
        setLines((prev) => {
          if (!prev.length) {
            return prev;
          }

          const next = [...prev];
          const lastLine = next[next.length - 1];
          next[next.length - 1] = { ...lastLine, text: `${lastLine.text}${character}` };
          return next;
        });
      }

      setIsTyping(false);
      await wait(LINE_PAUSE_MS);
    },
    [wait]
  );

  const submitAnswer = useCallback(
    (rawAnswer: string) => {
      if (!awaitingInput || isTyping || submittedAnswer !== null) {
        return;
      }

      const userText = rawAnswer.trim();
      const normalizedAnswer = userText.toLowerCase().replace(/[!?.,]/g, '');

      setLines((prev) => [
        ...prev,
        { speaker: 'user', text: userText.length > 0 ? userText : '(empty)' },
      ]);
      setAwaitingInput(false);
      setInputValue('');
      setSubmittedAnswer(normalizedAnswer);
    },
    [awaitingInput, isTyping, submittedAnswer]
  );

  useEffect(() => {
    const runIntro = async () => {
      await appendSystemLine('Would You like to know who am I?');
      await appendSystemLine(personaLine);
      await appendSystemLine('Wanna know more?');

      if (!cancelledRef.current) {
        setAwaitingInput(true);
      }
    };

    runIntro();

    return () => {
      cancelledRef.current = true;
      timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, [appendSystemLine]);

  useEffect(() => {
    if (submittedAnswer === null) {
      return;
    }

    const runAfterAnswer = async () => {
      if (!yesVariants.has(submittedAnswer)) {
        await appendSystemLine("Whatever, it's my website..");
      }

      await appendSystemLine('Here is a short intro to my resume:');
      for (const line of resumeIntroLines) {
        await appendSystemLine(`- ${line}`);
      }
    };

    runAfterAnswer();
  }, [appendSystemLine, submittedAnswer]);

  useEffect(() => {
    const output = terminalOutputRef.current;
    if (!output) {
      return;
    }

    output.scrollTop = output.scrollHeight;
  }, [lines]);

  useEffect(() => {
    if (awaitingInput && !isTyping) {
      inputRef.current?.focus();
    }
  }, [awaitingInput, isTyping]);

  return (
    <main className="min-h-screen pt-28 pb-2 px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Resume
          </p>
          <p className="text-muted-foreground">
            Few words about my background and experience.
          </p>
        </header>

        <section className="p-0">
          <div className="py-4 md:py-6">
            <div
              ref={terminalOutputRef}
              className="h-[460px] overflow-y-auto p-4 text-sm text-black md:text-base"
            >
              {lines.map((line, index) => (
                <p key={`${line.speaker}-${index}`} className="whitespace-pre-wrap break-words leading-7">
                  <span className="text-black">
                    {line.speaker === 'user' ? '> ' : '$ '}
                  </span>
                  {line.text}
                </p>
              ))}

              {isTyping ? (
                <p className="leading-7 text-black">
                  <span>$ </span>
                  <span className="inline-block h-5 w-2 translate-y-1 animate-pulse bg-black" />
                </p>
              ) : null}
            </div>

            <div className="mt-3 flex items-center gap-2 px-3 py-2 text-sm text-black md:text-base">
              <span>&gt;</span>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(event) => {
                  const nextValue = event.target.value.slice(0, MAX_ANSWER_LENGTH);
                  setInputValue(nextValue);
                  if (nextValue.length === MAX_ANSWER_LENGTH) {
                    submitAnswer(nextValue);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') {
                    return;
                  }
                  event.preventDefault();
                  submitAnswer(inputValue);
                }}
                maxLength={MAX_ANSWER_LENGTH}
                disabled={!awaitingInput || isTyping || submittedAnswer !== null}
                className="w-full bg-transparent text-black outline-none disabled:cursor-not-allowed disabled:opacity-40"
                placeholder={
                  awaitingInput && !isTyping
                    ? 'Type max 10 chars...'
                    : 'Waiting for next prompt...'
                }
              />
              <span className="text-xs text-black/60">{inputValue.length}/10</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
