import { useState, useRef, useEffect } from 'react';
import './ChatBot.css';

const QA_LIST = [
  {
    keywords: ['admission', 'admissions', 'apply', 'how to apply', 'join', 'enroll'],
    question: 'How can I apply for admission?',
    answer:
      'You can apply for admission online through our Apply Now page. First Year and Direct Second Year admissions are available. Visit /admissions/apply or click "Apply Now" in the navigation menu.',
  },
  {
    keywords: ['fee', 'fees', 'fee structure', 'tuition', 'cost', 'charges'],
    question: 'What is the fee structure?',
    answer:
      'The fee structure varies by department and year. Please visit the Admissions > Fee Structure page for detailed information, or contact our office at +91-2162 284 040.',
  },
  {
    keywords: ['department', 'departments', 'branch', 'branches', 'courses', 'engineering'],
    question: 'What departments/courses are available?',
    answer:
      'We offer 6 engineering departments: Computer Engineering, Electronics & Telecommunication (ETC), Mechanical Engineering, Chemical Engineering, Electrical Engineering, and Automobile Engineering. All are 3-year diploma programs.',
  },
  {
    keywords: ['placement', 'placements', 'job', 'recruiters', 'employment'],
    question: 'What about placements?',
    answer:
      'We have an excellent placement record with top recruiters visiting our campus. Visit the Placements section for detailed information about our placement process, records, and recruiter list.',
  },
  {
    keywords: ['contact', 'phone', 'email', 'address', 'where', 'location', 'map'],
    question: 'How can I contact the college?',
    answer:
      'Phone: +91-2162 284 040\nEmail: officesatarapolytechnicsatara@gmail.com\nAddress: At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra.',
  },
  {
    keywords: ['scholarship', 'scholarships', 'financial aid', 'funding'],
    question: 'Are scholarships available?',
    answer:
      'Yes, scholarships are available for eligible students. Visit the Admissions > Scholarships page for details on government and merit-based scholarships.',
  },
  {
    keywords: ['examination', 'exam', 'exams', 'results', 'schedule'],
    question: 'Where can I find exam information?',
    answer:
      'Exam schedules, rules, results, and revaluation details are available in the Examination section. We follow MSBTE (Maharashtra State Board of Technical Education) examination patterns.',
  },
  {
    keywords: ['eligibility', 'eligible', 'criteria', 'qualify', 'requirement'],
    question: 'What is the eligibility criteria?',
    answer:
      'For First Year admission: SSC (10th) pass. For Direct Second Year: HSC (12th) with Science or ITI pass. Visit the Admissions > Eligibility page for detailed criteria.',
  },
  {
    keywords: ['library', 'books', 'reading'],
    question: 'Does the college have a library?',
    answer:
      'Yes, we have a well-equipped library with a large collection of books, journals, and digital resources. Visit the Campus > Library page for more details.',
  },
  {
    keywords: ['bus', 'transport', 'commute', 'travel'],
    question: 'Is bus facility available?',
    answer:
      'Yes, the college provides bus facility for students. Visit the Campus > Bus Facility page for route details and timings.',
  },
  {
    keywords: ['about', 'history', 'established', 'founded', 'overview'],
    question: 'Tell me about the college.',
    answer:
      'Satara Polytechnic, Satara is run by Satara Education Society. It is approved by AICTE Delhi, DTE Maharashtra State, and affiliated to MSBTE, Mumbai. We have been providing quality diploma engineering education with excellent infrastructure and experienced faculty.',
  },
  {
    keywords: ['governing body', 'management', 'chairman', 'secretary', 'principal'],
    question: 'Who manages the college?',
    answer:
      'The college is managed by Satara Education Society. You can find details about our Chairman, Secretary, Principal, and Governing Body members in the About > Management section.',
  },
  {
    keywords: ['campus', 'infrastructure', 'facilities', 'labs', 'lab'],
    question: 'What facilities are on campus?',
    answer:
      'Our campus includes modern laboratories, a library, canteen, bus facility, and well-equipped classrooms. Visit the Campus section for detailed information about all facilities.',
  },
  {
    keywords: ['syllabus', 'curriculum', 'subject', 'subjects'],
    question: 'What is the syllabus?',
    answer:
      'The curriculum is prescribed by MSBTE, Mumbai. Each department has a detailed syllabus for all 3 years (6 semesters). Visit the Departments page and select your branch to view the full curriculum.',
  },
  {
    keywords: ['acap', 'direct second year', 'lateral entry'],
    question: 'What is A-CAP and Direct Second Year admission?',
    answer:
      'A-CAP is the Admission Centralized Admission Process conducted by DTE Maharashtra. Direct Second Year admission is for HSC (Science) or ITI holders who can directly enter the second year. Visit Admissions for more details.',
  },
];

function getAnswer(input) {
  const text = input.toLowerCase().trim();
  for (const qa of QA_LIST) {
    for (const kw of qa.keywords) {
      if (text.includes(kw)) {
        return qa.answer;
      }
    }
  }
  return null;
}

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: 'Welcome to Satara Polytechnic! I can help you with admissions, fees, departments, placements, and more. Choose a question below or type your own.',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setMessages((prev) => [...prev, { from: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      const answer = getAnswer(userMsg);
      if (answer) {
        setMessages((prev) => [...prev, { from: 'bot', text: answer }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            from: 'bot',
            text: "Sorry, I don't have an answer for that. Please try one of the suggested questions, or contact our office at +91-2162 284 040 or officesatarapolytechnicsatara@gmail.com.",
          },
        ]);
      }
    }, 400);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'How to apply?',
    'Fee structure',
    'Departments',
    'Placements',
    'Contact info',
    'Scholarships',
    'Eligibility',
    'Exam schedule',
  ];

  return (
    <>
      {/* Floating button */}
      <button
        className={`chatbot-fab ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
              </div>
              <div>
                <h4>College Assistant</h4>
                <span className="chatbot-status">Online</span>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setIsOpen(false)} aria-label="Close chat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg ${msg.from}`}>
                <div className="chatbot-bubble">{msg.text}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions */}
          <div className="chatbot-quick">
            {quickQuestions.map((q) => (
              <button key={q} className="chatbot-quick-btn" onClick={() => handleSend(q)}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="chatbot-send" onClick={() => handleSend()} disabled={!input.trim()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;
