import React, { useState } from 'react';

export const CommunityRoomView = ({
  community,
  events = [],
  onBack,
  onSelectEvent,
  onPlanCommunityEvent,
  sponsorshipRequests = [],
  currentUser,
}) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Aravind Swaminathan', role: 'Organizer', text: 'Hey everyone! Excited to associate our upcoming AI Summit with this community. Any ideas for volunteer tasks?', time: '10:24 AM' },
    { id: 2, sender: 'Meera Sen', role: 'Member', text: 'I would love to help coordinate the keynote speakers or stage setup!', time: '10:45 AM' },
    { id: 3, sender: 'Vikram Grover', role: 'Member', text: 'Let’s organize a pre-event mixer for community members in the room.', time: '11:02 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Interactive Activities State
  const [activities, setActivities] = useState([
    {
      id: 'act-1',
      title: 'AI General Knowledge Trivia',
      type: 'Trivia',
      questionsCount: 3,
      status: 'Ready', // Ready, Live, Completed
      roomCode: 'QUIZ8472',
      createdType: 'AI Generated',
      difficulty: 'Medium',
      questions: [
        {
          question: 'What does AI stand for?',
          options: ['Automated Intelligence', 'Artificial Intelligence', 'Advanced Information', 'Automated Information'],
          correct: 1,
          explanation: 'AI stands for Artificial Intelligence.',
          difficulty: 'Easy'
        },
        {
          question: 'Which neural network architecture is primarily used in LLMs like GPT?',
          options: ['CNN', 'RNN', 'Transformer', 'LSTM'],
          correct: 2,
          explanation: 'Transformer architecture is the base for Generative Pre-trained Transformers.',
          difficulty: 'Medium'
        },
        {
          question: 'Who coined the term "Artificial Intelligence" in 1956?',
          options: ['Alan Turing', 'John McCarthy', 'Marvin Minsky', 'Claude Shannon'],
          correct: 1,
          explanation: 'John McCarthy organized the famous Dartmouth workshop where the term was coined.',
          difficulty: 'Hard'
        }
      ]
    },
    {
      id: 'act-2',
      title: 'Developer Pulse Survey',
      type: 'Poll',
      questionsCount: 1,
      status: 'Completed',
      roomCode: 'POLL1029',
      createdType: 'Manual',
      questions: [
        {
          question: 'Which frontend framework do you prefer for new projects?',
          options: ['React', 'Vue', 'Angular', 'Svelte'],
          results: [42, 12, 10, 8] // votes count
        }
      ]
    }
  ]);

  // Creator flows
  const [creatorFlow, setCreatorFlow] = useState(null); // 'library' | 'manual' | 'ai' | 'custom'
  const [selectedLibActivity, setSelectedLibActivity] = useState(null);
  
  // AI Quiz Creator fields
  const [quizTopic, setQuizTopic] = useState('Artificial Intelligence');
  const [quizDomain, setQuizDomain] = useState('Technology');
  const [quizCount, setQuizCount] = useState(3);
  const [quizDifficulty, setQuizDifficulty] = useState('Medium');
  
  // AI Trivia fields
  const [triviaCategory, setTriviaCategory] = useState('Pop Culture');
  const [triviaCount, setTriviaCount] = useState(3);
  const [triviaDifficulty, setTriviaDifficulty] = useState('Medium');

  // AI Rapid Fire fields
  const [rapidFireTopic, setRapidFireTopic] = useState('Coding General Knowledge');
  const [rapidFireCount, setRapidFireCount] = useState(3);
  const [rapidFireTime, setRapidFireTime] = useState(15);

  // AI Guess the Person fields
  const [personCategory, setPersonCategory] = useState('Scientists & Inventors');
  const [personCount, setPersonCount] = useState(3);
  const [personDifficulty, setPersonDifficulty] = useState('Medium');

  // AI Generic fields
  const [genericTopic, setGenericTopic] = useState('General Tech Fun');
  const [genericCount, setGenericCount] = useState(3);
  const [genericDifficulty, setGenericDifficulty] = useState('Medium');

  const [configOption, setConfigOption] = useState('manual'); // 'manual' | 'ai'
  
  // Custom Activity Idea description
  const [customDesc, setCustomDesc] = useState('');
  const [customActivityDraft, setCustomActivityDraft] = useState(null);

  // Edit/Review Questions buffer
  const [draftQuestions, setDraftQuestions] = useState([]);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftType, setDraftType] = useState('Quiz');

  // Live game controls
  const [liveActId, setLiveActId] = useState(null);
  const [liveQuestionIdx, setLiveQuestionIdx] = useState(0);
  const [liveAttendees, setLiveAttendees] = useState([
    { name: 'Aravind', score: 0, answers: [] },
    { name: 'Meera', score: 0, answers: [] },
    { name: 'Vikram', score: 0, answers: [] }
  ]);
  const [simNickname, setSimNickname] = useState('You');
  const [simJoined, setSimJoined] = useState(false);
  const [simRoomCode, setSimRoomCode] = useState('');
  const [simAnswered, setSimAnswered] = useState(false);
  const [simSelectedOption, setSimSelectedOption] = useState(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: Date.now(),
      sender: 'You',
      role: 'Member',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, msg]);
    setNewMessage('');
  };

  // Filter events associated with this community
  const communityEvents = events.filter(
    (evt) => evt.associatedCommunities && evt.associatedCommunities.includes(community.name)
  );

  // Categorize events dynamically
  const now = new Date();
  const ongoingEvents = [];
  const upcomingEvents = [];
  const pastEvents = [];

  communityEvents.forEach((evt) => {
    const start = new Date(evt.startDate);
    const end = evt.endDate ? new Date(evt.endDate) : start;
    if (end < now && end.toDateString() !== now.toDateString()) {
      pastEvents.push(evt);
    } else if (start > now && start.toDateString() !== now.toDateString()) {
      upcomingEvents.push(evt);
    } else {
      ongoingEvents.push(evt);
    }
  });

  const handleAddQuestion = () => {
    setDraftQuestions([
      ...draftQuestions,
      {
        question: `New Question ${draftQuestions.length + 1}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correct: 0,
        explanation: '',
        difficulty: 'Medium'
      }
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    setDraftQuestions(draftQuestions.filter((_, i) => i !== idx));
  };

  const handleUpdateQuestion = (idx, key, val) => {
    setDraftQuestions(
      draftQuestions.map((q, i) => (i === idx ? { ...q, [key]: val } : q))
    );
  };

  const handleUpdateOption = (qIdx, optIdx, val) => {
    const q = draftQuestions[qIdx];
    const newOptions = q.options.map((opt, oIdx) => (oIdx === optIdx ? val : opt));
    handleUpdateQuestion(qIdx, 'options', newOptions);
  };

  const handleGenerateWithAI = () => {
    if (!selectedLibActivity) return;

    let generated = [];
    let titleVal = '';

    if (selectedLibActivity.type === 'Quiz') {
      const mockTopics = {
        'Artificial Intelligence': [
          {
            question: 'What is the main goal of Machine Learning?',
            options: ['Create web pages', 'Train algorithms to learn from data', 'Design computer hardware', 'None of the above'],
            correct: 1,
            explanation: 'ML aims to train models to learn and improve from experience.',
            difficulty: quizDifficulty
          },
          {
            question: 'Which of the following is a subset of AI?',
            options: ['Web Dev', 'Deep Learning', 'Cloud Computing', 'SQL'],
            correct: 1,
            explanation: 'Deep learning is a subset of Machine Learning, which is a subset of AI.',
            difficulty: quizDifficulty
          },
          {
            question: 'What does NLP stand for in AI?',
            options: ['Natural Language Processing', 'Neural Logic Processing', 'Network Link Protocol', 'Next-gen Linear Program'],
            correct: 0,
            explanation: 'NLP deals with computing models analyzing natural human language.',
            difficulty: quizDifficulty
          }
        ],
        'Data Science': [
          {
            question: 'What is pandas primarily used for in Python?',
            options: ['Game development', 'Data manipulation & analysis', 'Sending HTTP requests', 'Encrypting files'],
            correct: 1,
            explanation: 'Pandas is a data analysis package for structure manipulation.',
            difficulty: quizDifficulty
          },
          {
            question: 'What type of learning is classification?',
            options: ['Supervised', 'Unsupervised', 'Reinforcement', 'None of the above'],
            correct: 0,
            explanation: 'Classification maps inputs to labels based on labeled training data.',
            difficulty: quizDifficulty
          }
        ]
      };
      generated = mockTopics[quizTopic] || [
        {
          question: `Tell us something about ${quizTopic}?`,
          options: ['Correct Option A', 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: `Generated query results matching ${quizTopic}.`,
          difficulty: quizDifficulty
        }
      ];
      titleVal = `${quizTopic} Quiz`;
    } else if (selectedLibActivity.type === 'Trivia') {
      generated = [
        {
          question: `Which is a famous trivia fact about ${triviaCategory}?`,
          options: ['Option A (Correct)', 'Option B', 'Option C', 'Option D'],
          correct: 0,
          explanation: `Cool trivia fact about ${triviaCategory}.`,
          difficulty: triviaDifficulty
        },
        {
          question: `Who is commonly associated with ${triviaCategory}?`,
          options: ['Famous Inventor', 'Famous Artist', 'Famous Builder', 'None of the above'],
          correct: 0,
          explanation: `Historical association to ${triviaCategory}.`,
          difficulty: triviaDifficulty
        }
      ];
      titleVal = `${triviaCategory} Trivia`;
    } else if (selectedLibActivity.type === 'Rapid Fire') {
      generated = [
        {
          question: `True or False: JavaScript is single-threaded?`,
          options: ['True', 'False'],
          correct: 0,
          explanation: 'JavaScript is single-threaded but supports asynchronous execution.',
          difficulty: 'Easy'
        },
        {
          question: `What does HTTP stand for?`,
          options: ['Hypertext Transfer Protocol', 'Hyperlink Text Protocol', 'Home Tool Tech Program', 'Hyper Transfer Text Program'],
          correct: 0,
          explanation: 'HTTP is Hypertext Transfer Protocol.',
          difficulty: 'Easy'
        }
      ];
      titleVal = `${rapidFireTopic} Rapid Fire`;
    } else if (selectedLibActivity.type === 'Guess the Person') {
      generated = [
        {
          question: `Who developed the Special Theory of Relativity?`,
          options: ['Albert Einstein', 'Isaac Newton', 'Galileo Galilei', 'Marie Curie'],
          correct: 0,
          explanation: 'Albert Einstein published this in 1905.',
          difficulty: personDifficulty
        },
        {
          question: `Who co-founded Microsoft alongside Bill Gates?`,
          options: ['Steve Jobs', 'Paul Allen', 'Steve Ballmer', 'Tim Cook'],
          correct: 1,
          explanation: 'Paul Allen co-founded Microsoft in 1975.',
          difficulty: personDifficulty
        }
      ];
      titleVal = `${personCategory} - Guess the Person`;
    } else {
      // Generic fallback
      generated = [
        {
          question: `Challenge Prompt: Describe or guess the term for ${genericTopic}?`,
          options: ['Term A (Correct)', 'Term B', 'Term C', 'Term D'],
          correct: 0,
          explanation: `Generated clue for ${selectedLibActivity.name}.`,
          difficulty: genericDifficulty
        }
      ];
      titleVal = `${genericTopic} - ${selectedLibActivity.name}`;
    }

    setDraftQuestions(generated);
    setDraftTitle(titleVal);
    setDraftType(selectedLibActivity.type);
    setCreatorFlow('review');
  };

  // Custom activity rules generator mock helper
  const handleGenerateCustomRules = () => {
    if (!customDesc.trim()) return;
    setCustomActivityDraft({
      title: '20-Minute Solution Challenge',
      objective: 'Solve the given real-world problem statement in groups.',
      instructions: 'Form teams of 3-5, research the topic, formulate a presentation deck, and upload it before the timer ends.',
      duration: '20 Minutes',
      teamStructure: 'Teams of 3 to 5 members',
      scoringCriteria: [
        { name: 'Innovation', maxPoints: 30 },
        { name: 'Feasibility', maxPoints: 30 },
        { name: 'Impact', maxPoints: 20 },
        { name: 'Presentation', maxPoints: 20 }
      ],
      rules: 'All submissions must be original work. Presentation must not exceed 5 slides. Late submissions lose 10 points per minute.'
    });
  };

  const handlePublishActivity = () => {
    const newActivity = {
      id: `act-created-${Date.now()}`,
      title: draftTitle || 'New Interactive Challenge',
      type: draftType,
      questionsCount: draftQuestions.length,
      status: 'Ready',
      roomCode: `GAME${Math.floor(1000 + Math.random() * 9000)}`,
      createdType: 'AI Assistant',
      difficulty: quizDifficulty,
      questions: draftQuestions
    };
    setActivities([newActivity, ...activities]);
    setCreatorFlow(null);
    setDraftQuestions([]);
    setDraftTitle('');
  };

  const handlePublishCustomActivity = () => {
    if (!customActivityDraft) return;
    const newActivity = {
      id: `act-created-${Date.now()}`,
      title: customActivityDraft.title,
      type: 'Build Challenge',
      status: 'Ready',
      roomCode: `CHAL${Math.floor(1000 + Math.random() * 9000)}`,
      createdType: 'Custom described AI design',
      customRules: customActivityDraft
    };
    setActivities([newActivity, ...activities]);
    setCreatorFlow(null);
    setCustomActivityDraft(null);
    setCustomDesc('');
  };

  const handleStartLive = (act) => {
    setLiveActId(act.id);
    setLiveQuestionIdx(0);
    setLiveAttendees([
      { name: 'Aravind', score: 0, answers: [] },
      { name: 'Meera', score: 0, answers: [] },
      { name: 'Vikram', score: 0, answers: [] }
    ]);
    setSimJoined(false);
    setSimAnswered(false);
    setSimSelectedOption(null);
    setActivities(
      activities.map((a) => (a.id === act.id ? { ...a, status: 'Live' } : a))
    );
  };

  const handleEndLiveGame = () => {
    setActivities(
      activities.map((a) => (a.id === liveActId ? { ...a, status: 'Completed' } : a))
    );
    setLiveActId(null);
  };

  const handleSimSubmitOption = (optIdx, act) => {
    if (simAnswered) return;
    setSimSelectedOption(optIdx);
    setSimAnswered(true);

    const activeQuestion = act.questions[liveQuestionIdx];
    const isCorrect = optIdx === activeQuestion.correct;
    
    // Add point to simulator scores list
    const updatedAttendees = liveAttendees.map((att) => {
      if (att.name === simNickname) {
        const newScore = isCorrect ? att.score + 100 : att.score;
        return { ...att, score: newScore, answers: [...att.answers, optIdx] };
      }
      return att;
    });

    // Simulated responses from other attendees
    const nextAttendees = updatedAttendees.map((att) => {
      if (att.name !== simNickname) {
        // Random correct/incorrect guess
        const correctGuess = Math.random() > 0.4;
        const answerVal = correctGuess ? activeQuestion.correct : (activeQuestion.correct + 1) % 4;
        const newScore = correctGuess ? att.score + 100 : att.score;
        return { ...att, score: newScore, answers: [...att.answers, answerVal] };
      }
      return att;
    });

    setLiveAttendees(nextAttendees);
  };

  const handleNextLiveQuestion = (act) => {
    if (liveQuestionIdx < act.questions.length - 1) {
      setLiveQuestionIdx(liveQuestionIdx + 1);
      setSimAnswered(false);
      setSimSelectedOption(null);
    } else {
      // End game
      handleEndLiveGame();
    }
  };

  const renderEventCard = (evt) => (
    <div
      key={evt.id}
      onClick={() => onSelectEvent(evt)}
      className="p-4 border border-gray-200 rounded-xl bg-[#f8f9fa] hover:border-[#c2c7d1] hover:bg-white cursor-pointer transition-all space-y-2 text-left"
    >
      <div className="flex justify-between items-center">
        <span className="text-[8px] font-bold text-[#0f4c81] bg-[#d2e4ff] px-2 py-0.5 rounded uppercase font-bold">
          {evt.category}
        </span>
        <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
          evt.status === 'Active' || !evt.status ? 'bg-green-50 text-green-700 font-bold' : 'bg-gray-100 text-gray-500 font-bold'
        }`}>
          {evt.status || 'Active'}
        </span>
      </div>

      <h4 className="font-geist font-bold text-xs text-black leading-tight">{evt.title}</h4>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] text-gray-500 font-inter border-t border-gray-100 pt-2">
        <div><strong>Date:</strong> {evt.startDate}</div>
        <div><strong>Time:</strong> {evt.time}</div>
        <div className="col-span-2 truncate"><strong>Venue:</strong> {evt.location}, {evt.city}</div>
        <div className="col-span-2"><strong>Organizer:</strong> {evt.organizer || 'Community Admin'}</div>
        {evt.speakers && evt.speakers.length > 0 && (
          <div className="col-span-2 truncate"><strong>Speakers:</strong> {evt.speakers.map(s => s.name).join(', ')}</div>
        )}
        <div><strong>Registrations:</strong> {evt.registeredCount || 0}</div>
        <div><strong>Volunteers:</strong> {evt.volunteersNeeded > 0 ? `${evt.volunteersNeeded} req` : 'None'}</div>
      </div>
    </div>
  );

  return (
    <div className="px-4 md:px-10 max-w-[1280px] mx-auto py-8 space-y-8 animate-fadeIn">
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e4] pb-6">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 font-geist text-xs font-bold text-gray-500 hover:text-black transition-colors mb-2 cursor-pointer border-none bg-transparent p-0"
          >
            <span>← Back to My Communities</span>
          </button>
          <span className="font-geist text-xs font-bold text-[#0f4c81] uppercase tracking-wider block text-left font-bold">
            Private Space
          </span>
          <h1 className="font-geist text-2xl md:text-3xl font-bold text-[#00355f] text-left">
            {community.name} Room
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-white border border-[#e1e3e4] px-5 py-3 rounded-2xl shadow-2xs text-xs font-inter text-[#5f5e5e]">
          <div>
            <span className="font-bold text-[#00355f] block">Members</span>
            <span>👥 {community.memberCount + (messages.filter(m => m.sender === 'You').length ? 1 : 0)} joined</span>
          </div>
          <div className="border-l border-[#e1e3e4] pl-4">
            <span className="font-bold text-[#00355f] block">Room Code</span>
            <span className="font-mono bg-gray-50 px-2 py-0.5 border border-gray-100 rounded text-[10px] font-bold text-[#0f4c81]">
              {community.code}
            </span>
          </div>
        </div>
      </div>

      {/* Community Room Tabs */}
      <div className="flex flex-wrap gap-4 border-b border-[#e1e3e4] pb-2 text-left">
        {[
          { id: 'overview', label: 'Overview & Messages' },
          { id: 'events', label: 'Community Events' },
          { id: 'members', label: 'Active Members' },
          { id: 'activities', label: '🎮 Events & Activities Center' },
          { id: 'registrations', label: 'Registrations' },
          { id: 'sponsorships', label: `💰 Sponsorships${sponsorshipRequests.length > 0 ? ` (${sponsorshipRequests.length})` : ''}` }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 px-1 text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'border-b-2 border-[#00355f] text-[#00355f]'
                : 'text-[#5f5e5e] hover:text-[#00355f]'
            } border-none bg-transparent`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview & Messages Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left column: Feed/Chat Room */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-6 flex flex-col h-[580px] justify-between">
              <div className="text-left">
                <h3 className="font-geist text-lg font-bold text-[#00355f]">Community Message Board</h3>
                <p className="font-inter text-xs text-[#5f5e5e] mt-1">Connect, collaborate, and share with other members of the room.</p>
              </div>

              {/* Scrollable Message List */}
              <div className="flex-grow overflow-y-auto my-4 space-y-4 pr-2 scrollbar-thin">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col space-y-1 max-w-[85%] ${
                      msg.sender === 'You' ? 'ml-auto items-end' : 'items-start'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] font-inter text-gray-500">
                      <span className="font-bold text-[#00355f]">{msg.sender}</span>
                      {msg.role && (
                        <span className={`px-1.5 py-0.2 rounded-full text-[8px] font-extrabold uppercase ${
                          msg.role === 'Organizer' ? 'bg-[#fff3d6] text-[#b46d00]' : 'bg-[#d2e4ff] text-[#0f4c81]'
                        }`}>
                          {msg.role}
                        </span>
                      )}
                      <span>• {msg.time}</span>
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl text-xs font-inter leading-relaxed text-left ${
                        msg.sender === 'You'
                          ? 'bg-[#0f4c81] text-white rounded-tr-none'
                          : 'bg-[#f8f9fa] border border-[#e1e3e4] text-[#191c1d] rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Send Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2 pt-4 border-t border-[#edeeef]">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message to post to the board..."
                  className="flex-grow px-4 py-3 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-inter focus:outline-none focus:border-[#0f4c81] focus:bg-white"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl font-geist font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

          {/* Right column: Quick Member List Preview */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-4">
              <h3 className="font-geist text-base font-bold text-[#00355f] text-left">Active Members</h3>
              <div className="space-y-3 pt-2">
                {[
                  { name: 'Aravind Swaminathan', initials: 'AS', role: 'Organizer', desc: 'Host & Director' },
                  { name: 'Meera Sen', initials: 'MS', role: 'Member', desc: 'Product Designer' },
                  { name: 'Vikram Grover', initials: 'VG', role: 'Member', desc: 'Developer Relations' }
                ].map((member, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#d2e4ff] text-[#0f4c81] font-geist font-bold text-xs flex items-center justify-center font-bold font-bold font-bold font-bold font-bold">
                      {member.initials}
                    </div>
                    <div className="text-left flex-grow">
                      <h4 className="font-geist text-xs font-bold text-[#00355f]">{member.name}</h4>
                      <p className="font-inter text-[10px] text-gray-500 leading-none">{member.desc}</p>
                    </div>
                    <span className={`px-1.5 py-0.2 rounded-full text-[7px] font-extrabold uppercase ${
                      member.role === 'Organizer' ? 'bg-[#fff3d6] text-[#b46d00]' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-6">
          <div className="flex justify-between items-center border-b border-[#edeeef] pb-4">
            <div className="text-left">
              <h3 className="font-geist text-lg font-bold text-[#00355f]">Community Events list</h3>
              <p className="font-inter text-xs text-[#5f5e5e] mt-1 font-medium">Browse ongoing, upcoming, and past community events.</p>
            </div>
            <button
              onClick={() => onPlanCommunityEvent(community.name)}
              className="px-4 py-2 bg-[#0f4c81] hover:bg-[#00355f] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95 flex items-center gap-1 border-none"
            >
              <span className="material-symbols-outlined text-[14px] font-bold">add</span>
              <span>Create Event</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {/* Ongoing */}
            {ongoingEvents.length > 0 && (
              <div className="space-y-3">
                <span className="text-[9px] font-extrabold uppercase text-green-700 bg-green-50 px-2 py-0.5 rounded tracking-wider block w-fit">
                  Ongoing
                </span>
                {ongoingEvents.map(renderEventCard)}
              </div>
            )}

            {/* Upcoming */}
            {upcomingEvents.length > 0 && (
              <div className="space-y-3">
                <span className="text-[9px] font-extrabold uppercase text-[#0f4c81] bg-[#d2e4ff] px-2 py-0.5 rounded tracking-wider block w-fit">
                  Upcoming
                </span>
                {upcomingEvents.map(renderEventCard)}
              </div>
            )}

            {/* Past */}
            {pastEvents.length > 0 && (
              <div className="space-y-3">
                <span className="text-[9px] font-extrabold uppercase text-gray-500 bg-gray-100 px-2 py-0.5 rounded tracking-wider block w-fit">
                  Past
                </span>
                {pastEvents.map(renderEventCard)}
              </div>
            )}
          </div>
          {communityEvents.length === 0 && (
            <p className="text-sm text-gray-400 italic text-center py-12">No events associated with this community yet.</p>
          )}
        </div>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-6">
          <div className="text-left border-b border-[#edeeef] pb-4">
            <h3 className="font-geist text-lg font-bold text-[#00355f]">Active Community Members</h3>
            <p className="font-inter text-xs text-[#5f5e5e] mt-1 font-medium">Verify joined users, participants, and role levels inside the room.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { name: 'Aravind Swaminathan', initials: 'AS', role: 'Organizer', desc: 'Host & Director', email: 'aravind@mavora.dev' },
              { name: 'Meera Sen', initials: 'MS', role: 'Member', desc: 'Product Designer', email: 'meera@assemble.dev' },
              { name: 'Vikram Grover', initials: 'VG', role: 'Member', desc: 'Developer Relations', email: 'vikram@aura.io' },
              { name: 'Samantha Clark', initials: 'SC', role: 'Member', desc: 'Frontend Dev', email: 'samantha@clark.io' }
            ].map((member, i) => (
              <div key={i} className="p-4 border border-[#e1e3e4] bg-[#f8f9fa] rounded-2xl flex items-center gap-4 text-left hover:bg-white hover:border-[#c2c7d1] transition-all">
                <div className="w-10 h-10 rounded-full bg-[#d2e4ff] text-[#0f4c81] font-geist font-bold text-sm flex items-center justify-center font-bold">
                  {member.initials}
                </div>
                <div className="flex-grow">
                  <h4 className="font-geist text-xs font-bold text-[#00355f]">{member.name}</h4>
                  <p className="font-inter text-[10px] text-gray-500 leading-normal">{member.desc}</p>
                  <p className="font-inter text-[9px] text-[#0f4c81] leading-none mt-1">{member.email}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-extrabold uppercase ${
                  member.role === 'Organizer' ? 'bg-[#fff3d6] text-[#b46d00]' : 'bg-white border border-[#e1e3e4] text-gray-500'
                }`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Events & Activities Center Tab */}
      {activeTab === 'activities' && (
        <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#edeeef] pb-4">
            <div className="text-left">
              <h3 className="font-geist text-lg font-bold text-[#00355f] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#0f4c81]">sports_esports</span>
                <span>Community Gaming & Activities Center</span>
              </h3>
              <p className="font-inter text-xs text-[#5f5e5e] mt-1 font-medium text-left">
                Create quizzes, live polls, word puzzles, scavenger hunts, or custom team challenges.
              </p>
            </div>
            {!creatorFlow && !liveActId && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setCreatorFlow('library');
                    setSelectedLibActivity(null);
                  }}
                  className="px-4 py-2 border border-[#c2c7d1] text-[#0f4c81] hover:bg-[#d2e4ff]/10 rounded-xl text-xs font-bold transition-all cursor-pointer bg-transparent"
                >
                  Browse Library
                </button>
                <button
                  onClick={() => {
                    setCreatorFlow('custom');
                    setCustomDesc('');
                    setCustomActivityDraft(null);
                  }}
                  className="px-4 py-2 border border-dashed border-[#0f4c81] text-[#0f4c81] hover:bg-[#d2e4ff]/10 rounded-xl text-xs font-bold transition-all cursor-pointer bg-transparent"
                >
                  Custom Activity Idea
                </button>
              </div>
            )}
          </div>

          {/* 1. Activity Library Panel */}
          {creatorFlow === 'library' && (
            <div className="space-y-6 text-left bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-6">
              <div className="flex justify-between items-center border-b border-[#e1e3e4] pb-3">
                <h4 className="font-geist text-sm font-bold text-[#00355f]">Ready-Made Games Library</h4>
                <button
                  type="button"
                  onClick={() => setCreatorFlow(null)}
                  className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer bg-transparent border-none"
                >
                  ✕ Close Library
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Live Quiz', desc: 'Multiple-choice questions with real-time scoring.', type: 'Quiz' },
                  { name: 'Tech Trivia', desc: 'General knowledge, pop culture, and sports trivia.', type: 'Trivia' },
                  { name: 'Audience Poll', desc: 'Create live audience polls and show real-time stats.', type: 'Poll' },
                  { name: 'Rapid Fire', desc: 'Participants answer a series of questions against a fast timer.', type: 'Rapid Fire' },
                  { name: 'Dumb Charades', desc: 'Team acting and guessing prompts generated dynamically.', type: 'Dumb Charades' },
                  { name: 'Picture Guess', desc: 'Display blurred or scrambled images to guess correctly.', type: 'Picture Guess' },
                  { name: 'Would You Rather', desc: 'Interactive choice-based survey activity.', type: 'Would You Rather' },
                  { name: 'Scavenger Hunt', desc: 'Solve clues and complete challenges to submit verification.', type: 'Scavenger Hunt' }
                ].map((lib) => (
                  <div
                    key={lib.name}
                    className="p-4 bg-white border border-[#e1e3e4] rounded-xl hover:border-[#0f4c81] hover:shadow-xs transition-all space-y-2 cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <h5 className="font-geist text-xs font-bold text-[#00355f]">{lib.name}</h5>
                      <p className="font-inter text-[10px] text-gray-500 leading-relaxed mt-1">{lib.desc}</p>
                    </div>
                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedLibActivity(lib);
                          setConfigOption('manual');
                          setCreatorFlow('configure-activity');
                        }}
                        className="px-3 py-1 bg-[#d2e4ff] text-[#0f4c81] hover:bg-[#0f4c81] hover:text-white rounded text-[10px] font-bold cursor-pointer border-none"
                      >
                        Select & Customize
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Activity Configuration Panel */}
          {creatorFlow === 'configure-activity' && selectedLibActivity && (
            <div className="space-y-6 text-left bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-6 max-w-lg mx-auto animate-fadeIn">
              <div className="flex justify-between items-center border-b border-[#e1e3e4] pb-3">
                <h4 className="font-geist text-sm font-bold text-[#00355f] flex items-center gap-1.5 font-bold">
                  <span className="material-symbols-outlined text-base">settings</span>
                  <span>Configure {selectedLibActivity.name}</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setCreatorFlow('library')}
                  className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer bg-transparent border-none"
                >
                  ← Back to Library
                </button>
              </div>

              <div className="space-y-4">
                {/* Method selector options */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase block">Creation Method</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfigOption('manual')}
                      className={`flex-1 py-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        configOption === 'manual'
                          ? 'border-[#0f4c81] bg-[#d2e4ff]/20 text-[#00355f]'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      Option 1 — Manual
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfigOption('ai')}
                      className={`flex-1 py-2.5 border rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        configOption === 'ai'
                          ? 'border-[#0f4c81] bg-[#d2e4ff]/20 text-[#00355f]'
                          : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      Option 2 — Create with AI
                    </button>
                  </div>
                </div>

                {configOption === 'manual' ? (
                  <div className="bg-white border border-[#e1e3e4] rounded-2xl p-4 space-y-3">
                    <p className="text-xs text-[#5f5e5e] font-inter leading-relaxed text-left">
                      Manually create your questions, multiple-choice options, select correct answers, and configure difficulty scores.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDraftTitle(selectedLibActivity.name);
                        setDraftType(selectedLibActivity.type);
                        setDraftQuestions([
                          {
                            question: `First question for ${selectedLibActivity.name}`,
                            options: ['Option A', 'Option B', 'Option C', 'Option D'],
                            correct: 0,
                            explanation: '',
                            difficulty: 'Medium'
                          }
                        ]);
                        setCreatorFlow('manual');
                      }}
                      className="w-full py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold shadow-xs cursor-pointer border-none"
                    >
                      Start Manual Creation
                    </button>
                  </div>
                ) : (
                  <div className="bg-white border border-[#e1e3e4] rounded-2xl p-4 space-y-4">
                    {/* Activity Specific AI Configurations */}
                    {selectedLibActivity.type === 'Quiz' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#00355f] uppercase block">Quiz Topic</label>
                          <input
                            type="text"
                            value={quizTopic}
                            onChange={(e) => setQuizTopic(e.target.value)}
                            placeholder="e.g. Artificial Intelligence"
                            className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Domain</label>
                            <select
                              value={quizDomain}
                              onChange={(e) => setQuizDomain(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="Technology">Technology</option>
                              <option value="Business">Business</option>
                              <option value="Science">Science</option>
                              <option value="General Knowledge">General Knowledge</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Number of Questions</label>
                            <select
                              value={quizCount}
                              onChange={(e) => setQuizCount(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="3">3 Questions</option>
                              <option value="5">5 Questions</option>
                              <option value="10">10 Questions</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#00355f] uppercase block">Difficulty</label>
                          <select
                            value={quizDifficulty}
                            onChange={(e) => setQuizDifficulty(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                            <option value="Mixed">Mixed</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {selectedLibActivity.type === 'Trivia' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#00355f] uppercase block">Trivia Category</label>
                          <input
                            type="text"
                            value={triviaCategory}
                            onChange={(e) => setTriviaCategory(e.target.value)}
                            placeholder="e.g. Pop Culture, Science, History"
                            className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Questions Count</label>
                            <select
                              value={triviaCount}
                              onChange={(e) => setTriviaCount(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="3">3 Questions</option>
                              <option value="5">5 Questions</option>
                              <option value="10">10 Questions</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Difficulty</label>
                            <select
                              value={triviaDifficulty}
                              onChange={(e) => setTriviaDifficulty(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedLibActivity.type === 'Rapid Fire' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#00355f] uppercase block">Rapid Fire Topic</label>
                          <input
                            type="text"
                            value={rapidFireTopic}
                            onChange={(e) => setRapidFireTopic(e.target.value)}
                            placeholder="e.g. JavaScript basics"
                            className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Number of Questions</label>
                            <select
                              value={rapidFireCount}
                              onChange={(e) => setRapidFireCount(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="3">3 Questions</option>
                              <option value="5">5 Questions</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Time Limit (seconds)</label>
                            <input
                              type="number"
                              value={rapidFireTime}
                              onChange={(e) => setRapidFireTime(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedLibActivity.type === 'Guess the Person' && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#00355f] uppercase block">Domain / Category</label>
                          <input
                            type="text"
                            value={personCategory}
                            onChange={(e) => setPersonCategory(e.target.value)}
                            placeholder="e.g. Scientists & Pioneers"
                            className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Number of People</label>
                            <select
                              value={personCount}
                              onChange={(e) => setPersonCount(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="3">3 People</option>
                              <option value="5">5 People</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Difficulty</label>
                            <select
                              value={personDifficulty}
                              onChange={(e) => setPersonDifficulty(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Generic fallback configurations */}
                    {!['Quiz', 'Trivia', 'Rapid Fire', 'Guess the Person'].includes(selectedLibActivity.type) && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#00355f] uppercase block">Activity Topic</label>
                          <input
                            type="text"
                            value={genericTopic}
                            onChange={(e) => setGenericTopic(e.target.value)}
                            placeholder={`e.g. Fun themes for ${selectedLibActivity.name}`}
                            className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none focus:border-[#0f4c81]"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Number of Prompts</label>
                            <select
                              value={genericCount}
                              onChange={(e) => setGenericCount(Number(e.target.value))}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="3">3 Prompts</option>
                              <option value="5">5 Prompts</option>
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#00355f] uppercase block">Difficulty</label>
                            <select
                              value={genericDifficulty}
                              onChange={(e) => setGenericDifficulty(e.target.value)}
                              className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs font-bold focus:outline-none"
                            >
                              <option value="Easy">Easy</option>
                              <option value="Medium">Medium</option>
                              <option value="Hard">Hard</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleGenerateWithAI}
                      className="w-full py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1 border-none font-bold"
                    >
                      <span className="material-symbols-outlined text-sm">auto_awesome</span>
                      <span>Create with AI</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 3. Custom Natural Language Description */}
          {creatorFlow === 'custom' && (
            <div className="space-y-6 text-left bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-6 max-w-lg mx-auto">
              <div className="flex justify-between items-center border-b border-[#e1e3e4] pb-3">
                <h4 className="font-geist text-sm font-bold text-[#00355f] flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">psychology</span>
                  <span>Create Custom Live Challenge</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setCreatorFlow(null)}
                  className="text-xs font-bold text-gray-500 hover:text-black cursor-pointer bg-transparent border-none"
                >
                  ✕ Cancel
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-[#00355f] uppercase block">Describe your game/activity idea</label>
                  <textarea
                    rows={4}
                    value={customDesc}
                    onChange={(e) => setCustomDesc(e.target.value)}
                    placeholder="e.g. I want participants to solve a real-world problem in 20 minutes. They should submit their solution and judges score them on creativity, feasibility, and impact."
                    className="w-full px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGenerateCustomRules}
                  className="w-full py-2.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center justify-center gap-1 border-none"
                >
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                  <span>Generate Activity Rules with AI</span>
                </button>

                {customActivityDraft && (
                  <div className="bg-white border border-[#e1e3e4] rounded-2xl p-4 space-y-3 mt-4 animate-fadeIn">
                    <span className="text-[9px] font-bold text-[#0f4c81] bg-[#d2e4ff] px-2 py-0.5 rounded uppercase font-bold">
                      Generated Structure
                    </span>
                    <h5 className="font-geist text-sm font-bold text-[#00355f]">{customActivityDraft.title}</h5>
                    <div className="space-y-2 text-[11px] text-[#5f5e5e] font-inter">
                      <p><strong>Objective:</strong> {customActivityDraft.objective}</p>
                      <p><strong>Instructions:</strong> {customActivityDraft.instructions}</p>
                      <p><strong>Duration:</strong> {customActivityDraft.duration} • <strong>Teams:</strong> {customActivityDraft.teamStructure}</p>
                      <div>
                        <strong>Scoring Criteria:</strong>
                        <ul className="list-disc pl-4 mt-0.5">
                          {customActivityDraft.scoringCriteria.map((sc) => (
                            <li key={sc.name}>{sc.name} ({sc.maxPoints} points)</li>
                          ))}
                        </ul>
                      </div>
                      <p><strong>Rules:</strong> {customActivityDraft.rules}</p>
                    </div>

                    <button
                      type="button"
                      onClick={handlePublishCustomActivity}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all mt-2 cursor-pointer border-none"
                    >
                      Publish Custom Challenge
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 4. Manual Activity and AI Review Question Editor */}
          {(creatorFlow === 'manual' || creatorFlow === 'review') && (
            <div className="space-y-6 text-left bg-[#f8f9fa] border border-[#e1e3e4] rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e1e3e4] pb-3">
                <div>
                  <h4 className="font-geist text-sm font-bold text-[#00355f]">
                    {creatorFlow === 'manual' ? 'Create Questions Manually' : 'Review & Refine AI-Generated Questions'}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5 font-inter">
                    Verify options, correct choices, and set difficulty before publishing.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="px-3.5 py-1.5 border border-[#c2c7d1] text-[#0f4c81] hover:bg-white rounded-xl text-xs font-bold cursor-pointer bg-transparent"
                  >
                    + Add Question
                  </button>
                  <button
                    type="button"
                    onClick={handlePublishActivity}
                    className="px-4 py-1.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold shadow-xs cursor-pointer border-none"
                  >
                    Publish Activity
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreatorFlow(null)}
                    className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-black cursor-pointer bg-transparent border-none"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#00355f] uppercase tracking-wider block">Activity Title</label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full max-w-md px-3 py-2 bg-white border border-[#c2c7d1] rounded-xl text-xs focus:outline-none"
                  placeholder="e.g. AI Trivia Championship"
                />
              </div>

              <div className="space-y-6">
                {draftQuestions.map((q, idx) => (
                  <div key={idx} className="p-5 bg-white border border-[#e1e3e4] rounded-2xl space-y-4 relative shadow-2xs">
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="absolute top-4 right-4 text-xs font-bold text-rose-600 hover:underline cursor-pointer border-none bg-transparent"
                    >
                      Delete
                    </button>
                    
                    <span className="text-[9px] font-extrabold uppercase bg-gray-100 text-[#0f4c81] px-2 py-0.5 rounded tracking-wider">
                      Question #{idx + 1}
                    </span>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-[#00355f] uppercase block">Question text</label>
                      <input
                        type="text"
                        value={q.question}
                        onChange={(e) => handleUpdateQuestion(idx, 'question', e.target.value)}
                        className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block">Option {String.fromCharCode(65 + oIdx)}</label>
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => handleUpdateOption(idx, oIdx, e.target.value)}
                            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#00355f] uppercase block">Correct Answer</label>
                        <select
                          value={q.correct}
                          onChange={(e) => handleUpdateQuestion(idx, 'correct', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs outline-none"
                        >
                          {q.options.map((opt, oIdx) => (
                            <option key={oIdx} value={oIdx}>
                              Option {String.fromCharCode(65 + oIdx)}: {opt}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#00355f] uppercase block">Difficulty</label>
                        <select
                          value={q.difficulty}
                          onChange={(e) => handleUpdateQuestion(idx, 'difficulty', e.target.value)}
                          className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs outline-none font-bold"
                        >
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-[#00355f] uppercase block">Explanation (Optional)</label>
                        <input
                          type="text"
                          value={q.explanation || ''}
                          onChange={(e) => handleUpdateQuestion(idx, 'explanation', e.target.value)}
                          className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs focus:outline-none"
                          placeholder="Why is this answer correct?"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Live Activity simulator room (split screen organizer control and simulated attendee) */}
          {liveActId && (() => {
            const activeAct = activities.find((a) => a.id === liveActId);
            if (!activeAct) return null;

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left bg-[#f8f9fa] border border-[#e1e3e4] rounded-3xl p-6 animate-fadeIn">
                
                {/* Left Panel: Organizer live controls */}
                <div className="space-y-5 border-b md:border-b-0 md:border-r border-[#e1e3e4] pb-6 md:pb-0 md:pr-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-700 px-2 py-0.5 rounded tracking-wider">
                      Live Room Controller
                    </span>
                    <button
                      type="button"
                      onClick={handleEndLiveGame}
                      className="text-xs font-bold text-rose-600 hover:underline cursor-pointer border-none bg-transparent"
                    >
                      End Activity
                    </button>
                  </div>

                  <div>
                    <h4 className="font-geist text-lg font-bold text-[#00355f]">{activeAct.title}</h4>
                    <p className="text-[10px] text-gray-500 font-inter mt-0.5">
                      Room Code: <span className="font-mono font-bold bg-white px-2 py-0.5 border border-[#e1e3e4] rounded text-black">{activeAct.roomCode}</span>
                    </p>
                  </div>

                  {activeAct.questions && activeAct.questions[liveQuestionIdx] && (
                    <div className="bg-white border border-[#e1e3e4] rounded-2xl p-5 space-y-3 shadow-2xs">
                      <div className="flex justify-between text-[10px] font-bold text-[#0f4c81]">
                        <span>ACTIVE QUESTION {liveQuestionIdx + 1} OF {activeAct.questions.length}</span>
                        <span>Points: 100</span>
                      </div>
                      
                      <p className="font-geist font-bold text-sm text-black">
                        {activeAct.questions[liveQuestionIdx].question}
                      </p>

                      <div className="space-y-1.5 pt-2">
                        {activeAct.questions[liveQuestionIdx].options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className={`p-2.5 rounded-xl border text-xs font-inter flex justify-between items-center ${
                              oIdx === activeAct.questions[liveQuestionIdx].correct
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-[#f8f9fa] border-gray-200 text-gray-700'
                            }`}
                          >
                            <span>Option {String.fromCharCode(65 + oIdx)}: {opt}</span>
                            {oIdx === activeAct.questions[liveQuestionIdx].correct && (
                              <span className="text-emerald-600 font-bold font-bold font-bold font-bold font-bold font-bold">Correct Answer ✓</span>
                            )}
                          </div>
                        ))}
                      </div>

                      {activeAct.questions[liveQuestionIdx].explanation && (
                        <p className="text-[10px] text-gray-400 font-inter italic pt-1">
                          Explanation: {activeAct.questions[liveQuestionIdx].explanation}
                        </p>
                      )}

                      <div className="pt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleNextLiveQuestion(activeAct)}
                          className="px-4 py-2 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold shadow-xs cursor-pointer border-none"
                        >
                          {liveQuestionIdx < activeAct.questions.length - 1 ? 'Next Question →' : 'Announce Winner 🏆'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Leaderboard Tracker */}
                  <div className="space-y-3">
                    <h5 className="font-geist text-xs font-bold text-[#00355f]">🏆 Real-Time Leaderboard</h5>
                    <div className="bg-white border border-[#e1e3e4] rounded-2xl overflow-hidden shadow-2xs divide-y divide-[#edeeef]">
                      {liveAttendees.map((att, rIdx) => (
                        <div key={att.name} className="p-3 flex justify-between items-center text-xs font-inter">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-400">#{rIdx + 1}</span>
                            <span className="font-semibold text-black">{att.name}</span>
                          </div>
                          <span className="font-bold text-[#0f4c81]">{att.score} pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Panel: Simulated attendee interface */}
                <div className="space-y-5 pl-0 md:pl-6">
                  <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded tracking-wider">
                    Simulated Attendee Device
                  </span>

                  {!simJoined ? (
                    <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 space-y-4 shadow-2xs">
                      <h4 className="font-geist text-sm font-bold text-[#00355f]">Join Live Activity</h4>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block">Nickname</label>
                          <input
                            type="text"
                            value={simNickname}
                            onChange={(e) => setSimNickname(e.target.value)}
                            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-500 uppercase block">Room Code</label>
                          <input
                            type="text"
                            value={simRoomCode}
                            onChange={(e) => setSimRoomCode(e.target.value)}
                            placeholder="e.g. QUIZ8472"
                            className="w-full px-3 py-2 bg-[#f8f9fa] border border-[#c2c7d1] rounded-xl text-xs font-mono font-bold focus:outline-none uppercase"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (simRoomCode.toUpperCase() !== activeAct.roomCode) {
                              alert('Incorrect room code.');
                              return;
                            }
                            setSimJoined(true);
                            // Add simulated player to attendees list
                            if (!liveAttendees.some((a) => a.name === simNickname)) {
                              setLiveAttendees([...liveAttendees, { name: simNickname, score: 0, answers: [] }]);
                            }
                          }}
                          className="w-full py-2 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-xl text-xs font-bold shadow-xs cursor-pointer border-none"
                        >
                          Join Room
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white border border-[#e1e3e4] rounded-2xl p-6 space-y-4 shadow-2xs">
                      <div className="flex justify-between items-center text-xs font-inter text-gray-500">
                        <span>Participant: <strong>{simNickname}</strong></span>
                        <span>Score: <strong>{liveAttendees.find((a) => a.name === simNickname)?.score || 0} pts</strong></span>
                      </div>

                      {activeAct.questions && activeAct.questions[liveQuestionIdx] && (
                        <div className="space-y-3">
                          <p className="font-geist font-bold text-xs text-black">
                            {activeAct.questions[liveQuestionIdx].question}
                          </p>

                          <div className="grid grid-cols-1 gap-2">
                            {activeAct.questions[liveQuestionIdx].options.map((opt, oIdx) => {
                              const isSelected = simSelectedOption === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => handleSimSubmitOption(oIdx, activeAct)}
                                  className={`p-3 rounded-xl border text-xs font-inter font-medium text-left transition-all ${
                                    isSelected
                                      ? 'border-[#0f4c81] bg-[#d2e4ff]/30 text-[#00355f]'
                                      : simAnswered
                                      ? 'border-gray-100 bg-gray-50/50 text-gray-400 cursor-not-allowed font-bold font-bold font-bold font-bold'
                                      : 'border-gray-200 bg-[#f8f9fa] hover:border-[#c2c7d1] cursor-pointer'
                                  }`}
                                  disabled={simAnswered}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                          {simAnswered && (
                            <div className="p-3 bg-gray-50 rounded-xl text-[11px] font-inter text-gray-500 border border-gray-100 font-bold">
                              {simSelectedOption === activeAct.questions[liveQuestionIdx].correct ? (
                                <span className="text-emerald-600">✓ Correct! +100 Points</span>
                              ) : (
                                <span className="text-rose-600">✗ Incorrect. The correct answer was Option {String.fromCharCode(65 + activeAct.questions[liveQuestionIdx].correct)}</span>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* 6. Active activities dashboard list */}
          {!creatorFlow && !liveActId && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-5 border border-[#e1e3e4] bg-white rounded-2xl space-y-4 text-left shadow-2xs hover:shadow-xs transition-all relative flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className={`text-[8px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          act.status === 'Ready'
                            ? 'bg-amber-50 text-amber-700 font-bold'
                            : act.status === 'Live'
                            ? 'bg-green-50 text-green-700 animate-pulse font-bold'
                            : 'bg-gray-100 text-gray-500 font-bold'
                        }`}>
                          {act.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-inter">{act.createdType}</span>
                      </div>

                      <h4 className="font-geist text-sm font-bold text-[#00355f]">{act.title}</h4>
                      <p className="font-inter text-xs text-gray-500">
                        Type: {act.type} • {act.questionsCount || 1} Question(s)
                      </p>
                      {act.roomCode && (
                        <p className="font-inter text-[10px] text-gray-400 font-bold">
                          Room Code: <span className="font-mono text-black">{act.roomCode}</span>
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-[#edeeef] flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setActivities(activities.filter((a) => a.id !== act.id));
                        }}
                        className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer border-none bg-transparent"
                      >
                        Remove
                      </button>

                      {act.status === 'Ready' && (
                        <button
                          type="button"
                          onClick={() => handleStartLive(act)}
                          className="px-3 py-1.5 bg-[#0f4c81] text-white hover:bg-[#00355f] rounded-lg text-xs font-bold cursor-pointer border-none"
                        >
                          Start Live
                        </button>
                      )}

                      {act.status === 'Completed' && (
                        <span className="text-xs font-bold text-emerald-600">✓ Finished</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Registrations Tab */}
      {activeTab === 'registrations' && (
        <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-6">
          <div className="text-left border-b border-[#edeeef] pb-4">
            <h3 className="font-geist text-lg font-bold text-[#00355f]">Attendee Registrations</h3>
            <p className="font-inter text-xs text-[#5f5e5e] mt-1 font-medium">Verify registrations for this community's hosted events.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-inter">
              <thead>
                <tr className="border-b border-[#e1e3e4] text-[#00355f] font-bold">
                  <th className="py-3 px-4">Attendee Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Registered Event</th>
                  <th className="py-3 px-4">Ticket Type</th>
                  <th className="py-3 px-4">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e1e3e4] text-gray-600">
                <tr>
                  <td className="py-3 px-4 font-bold text-[#00355f]">Samantha Clark</td>
                  <td className="py-3 px-4">samantha@clark.io</td>
                  <td className="py-3 px-4">AI Innovation Summit</td>
                  <td className="py-3 px-4">Standard General</td>
                  <td className="py-3 px-4">2026-08-12</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold text-[#00355f]">Meera Sen</td>
                  <td className="py-3 px-4">meera@assemble.dev</td>
                  <td className="py-3 px-4">AI Innovation Summit</td>
                  <td className="py-3 px-4">VIP Pass</td>
                  <td className="py-3 px-4">2026-08-14</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SPONSORSHIPS TAB ── */}
      {activeTab === 'sponsorships' && (
        <div className="bg-white border border-[#e1e3e4] rounded-[2.5rem] p-6 md:p-8 shadow-2xs space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#edeeef] pb-5">
            <div className="text-left">
              <h3 className="font-geist text-lg font-bold text-[#00355f] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0f4c81]">paid</span>
                Community Sponsorship Dashboard
              </h3>
              <p className="font-inter text-xs text-[#5f5e5e] mt-1 font-medium">
                All sponsorship applications submitted by team members — see who applied, which sponsor, and current approval status.
              </p>
            </div>

            {/* Summary badges */}
            <div className="flex gap-3 flex-wrap">
              <div className="bg-[#f8f9fa] border border-[#e1e3e4] rounded-xl px-4 py-2 text-center">
                <span className="font-geist text-lg font-bold text-[#00355f] block">{sponsorshipRequests.length}</span>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Total Applied</span>
              </div>
              <div className="bg-[#e2f7e2] border border-[#b7e8b7] rounded-xl px-4 py-2 text-center">
                <span className="font-geist text-lg font-bold text-[#1a853e] block">
                  {sponsorshipRequests.filter(r => r.status === 'Sponsorship Code Generated' || r.status === 'Approved' || r.status === 'Active').length}
                </span>
                <span className="text-[9px] text-[#1a853e] font-bold uppercase tracking-wider">Approved</span>
              </div>
              <div className="bg-[#fff3d6] border border-[#ffd54f] rounded-xl px-4 py-2 text-center">
                <span className="font-geist text-lg font-bold text-[#b46d00] block">
                  {sponsorshipRequests.filter(r => r.status === 'Requested').length}
                </span>
                <span className="text-[9px] text-[#b46d00] font-bold uppercase tracking-wider">Pending</span>
              </div>
            </div>
          </div>

          {/* Sponsorship applications table */}
          {sponsorshipRequests.length === 0 ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-300">handshake</span>
              <p className="text-sm text-gray-400 font-inter italic">No sponsorship applications yet.</p>
              <p className="text-xs text-gray-400">Team members can apply via the Sponsorships tab in the Organizer Dashboard.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-inter border-collapse">
                <thead className="bg-[#f8f9fa] border-b border-[#e1e3e4]">
                  <tr className="text-[#727780] font-bold uppercase tracking-wider text-[9px]">
                    <th className="p-4">Sponsor</th>
                    <th className="p-4">Applied By</th>
                    <th className="p-4">For Event</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Requirement</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edeeef]">
                  {sponsorshipRequests.map((req) => {
                    const isApproved = req.status === 'Sponsorship Code Generated' || req.status === 'Approved' || req.status === 'Active';
                    const isPending = req.status === 'Requested';
                    const isCurrentUser = currentUser && (req.appliedByEmail === currentUser.email || req.appliedBy === currentUser.name);

                    return (
                      <tr
                        key={req.requestId}
                        className={`transition-colors ${
                          isApproved ? 'bg-[#f0fdf4] hover:bg-[#e8faf0]' : 'hover:bg-gray-50'
                        }`}
                      >
                        {/* Sponsor */}
                        <td className="p-4">
                          <span className="font-semibold text-[#00355f]">{req.sponsorName}</span>
                        </td>

                        {/* Applied By */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                              isCurrentUser ? 'bg-[#0f4c81] text-white' : 'bg-[#d2e4ff] text-[#0f4c81]'
                            }`}>
                              {(req.appliedBy || 'T').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <span className="font-semibold text-[#00355f] block">{req.appliedBy || 'Team Member'}</span>
                              {isCurrentUser && (
                                <span className="text-[8px] text-[#0f4c81] font-bold uppercase">You</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Event */}
                        <td className="p-4 text-gray-600 max-w-[160px] truncate">{req.eventTitle}</td>

                        {/* Amount */}
                        <td className="p-4 font-bold text-[#1a853e]">${req.amount?.toLocaleString()}</td>

                        {/* Requirement */}
                        <td className="p-4">
                          <span className="px-2 py-0.5 bg-[#d2e4ff] text-[#0f4c81] text-[9px] font-bold rounded uppercase">
                            {req.requirement}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                            isApproved
                              ? 'bg-[#e2f7e2] text-[#1a853e]'
                              : isPending
                              ? 'bg-[#fff3d6] text-[#b46d00]'
                              : 'bg-[#e7e8e9] text-gray-500'
                          }`}>
                            {isApproved ? '✓ Approved' : req.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="p-4 text-gray-400">{req.date}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Exclusivity note */}
          <div className="flex items-start gap-2.5 bg-[#f0f7ff] border border-[#c7dcf7] rounded-xl px-4 py-3 text-xs font-inter text-[#3a5f8a]">
            <span className="material-symbols-outlined text-[#0f4c81] text-sm mt-0.5">lock</span>
            <span>
              <strong>Team Exclusivity Rule:</strong> Each sponsor can only be approached by one team member per event.
              If a sponsor is already claimed for an event, other members will be blocked from applying to the same sponsor for the same event.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
