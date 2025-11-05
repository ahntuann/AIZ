"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import styles from "./interview.module.scss";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Interview {
  id: string;
  role: string;
  level: string;
  date: string;
  messages: Message[];
}

export default function InterviewPage() {
  const [step, setStep] = useState<"setup" | "chat">("setup");
  const [role, setRole] = useState("");
  const [level, setLevel] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(
    null
  );

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load mock interviews
  useEffect(() => {
    const mockInterviews: Interview[] = [
      {
        id: "1",
        role: "Frontend Developer",
        level: "Senior",
        date: "2024-01-15",
        messages: [],
      },
      {
        id: "2",
        role: "Full Stack Engineer",
        level: "Mid-level",
        date: "2024-01-10",
        messages: [],
      },
      {
        id: "3",
        role: "React Developer",
        level: "Junior",
        date: "2024-01-05",
        messages: [],
      },
    ];
    setInterviews(mockInterviews);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStartInterview = async () => {
    if (!role || !level) {
      alert("Vui lòng chọn vai trò và trình độ");
      return;
    }

    const newInterview: Interview = {
      id: Date.now().toString(),
      role,
      level,
      date: new Date().toISOString().split("T")[0],
      messages: [],
    };

    setInterviews((prev) => [newInterview, ...prev]);
    setCurrentInterviewId(newInterview.id);
    setStep("chat");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, messages: [] }),
      });
      const data = await res.json();
      const newMessages: Message[] = [
        { role: "assistant", content: data.reply },
      ];
      setMessages(newMessages);

      // Update interview with initial message
      setInterviews((prev) =>
        prev.map((interview) =>
          interview.id === newInterview.id
            ? { ...interview, messages: newMessages }
            : interview
        )
      );
    } catch (error) {
      const errorMessage: Message[] = [
        { role: "assistant", content: "Lỗi kết nối, vui lòng thử lại." },
      ];
      setMessages(errorMessage);
      setInterviews((prev) =>
        prev.map((interview) =>
          interview.id === newInterview.id
            ? { ...interview, messages: errorMessage }
            : interview
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isLoading) return;

    const newUserMessage: Message = { role: "user", content: currentMessage };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, level, messages: newMessages }),
      });
      const data = await res.json();
      const updatedMessages: Message[] = [
        ...newMessages,
        { role: "assistant", content: data.reply },
      ];
      setMessages(updatedMessages);

      // Update interview in sidebar
      if (currentInterviewId) {
        setInterviews((prev) =>
          prev.map((interview) =>
            interview.id === currentInterviewId
              ? { ...interview, messages: updatedMessages }
              : interview
          )
        );
      }
    } catch (error) {
      const errorMessages: Message[] = [
        ...newMessages,
        { role: "assistant", content: "Lỗi trả lời..." },
      ];
      setMessages(errorMessages);
      if (currentInterviewId) {
        setInterviews((prev) =>
          prev.map((interview) =>
            interview.id === currentInterviewId
              ? { ...interview, messages: errorMessages }
              : interview
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setStep("setup");
    setRole("");
    setLevel("");
    setMessages([]);
    setCurrentInterviewId(null);
  };

  const handleSelectInterview = (interview: Interview) => {
    setCurrentInterviewId(interview.id);
    setRole(interview.role);
    setLevel(interview.level);
    setMessages(interview.messages);
    setStep("chat");
  };

  return (
    <div className={styles.interviewContainer}>
      {/* Main Content */}
      <main className={styles.mainContent}>
        {step === "setup" ? (
          // Setup Phase
          <div className={styles.setupContainer}>
            <Card className={styles.setupCard}>
              <CardHeader className={styles.cardHeader}>
                <CardTitle className={styles.cardTitle}>
                  Bắt đầu phỏng vấn của bạn
                </CardTitle>
              </CardHeader>
              <CardContent className={styles.cardContent}>
                <div className={styles.formGroup}>
                  <Label htmlFor="role" className={styles.formLabel}>
                    Chọn vai trò bạn muốn phỏng vấn
                  </Label>
                  <Select onValueChange={setRole} value={role}>
                    <SelectTrigger className={styles.selectTrigger}>
                      <SelectValue placeholder="Bạn ứng tuyển vị trí..." />
                    </SelectTrigger>
                    <SelectContent className={styles.selectContent}>
                      <SelectItem value="Frontend Developer">
                        Frontend Developer
                      </SelectItem>
                      <SelectItem value="Backend Developer">
                        Backend Developer
                      </SelectItem>
                      <SelectItem value="Full Stack Engineer">
                        Full Stack Engineer
                      </SelectItem>
                      <SelectItem value="React Developer">
                        React Developer
                      </SelectItem>
                      <SelectItem value="Node.js Developer">
                        Node.js Developer
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="level" className={styles.formLabel}>
                    Chọn trình độ của bạn
                  </Label>
                  <Select onValueChange={setLevel} value={level}>
                    <SelectTrigger className={styles.selectTrigger}>
                      <SelectValue placeholder="Trình độ của bạn..." />
                    </SelectTrigger>
                    <SelectContent className={styles.selectContent}>
                      <SelectItem value="Intern">Intern</SelectItem>
                      <SelectItem value="Fresher">Fresher</SelectItem>
                      <SelectItem value="Junior">Junior</SelectItem>
                      <SelectItem value="Mid-level">Mid-level</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                      <SelectItem value="Lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={handleStartInterview}
                  className={styles.startButton}
                  disabled={isLoading}
                >
                  {isLoading ? "Đang khởi tạo AI..." : "Bắt đầu phỏng vấn"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Chat Phase with Sidebar
          <>
            {/* Sidebar */}
            <div className={styles.sidebar}>
              <a href="/" className={styles.logo}>
                AIZ
              </a>
              <div className={styles.sidebarHeader}>
                <button
                  onClick={handleNewChat}
                  className={styles.newChatButton}
                >
                  + Mới
                </button>
              </div>
              <div className={styles.interviewList}>
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className={`${styles.interviewItem} ${
                      interview.id === currentInterviewId ? styles.active : ""
                    }`}
                    onClick={() => handleSelectInterview(interview)}
                  >
                    <div className={styles.interviewRole}>{interview.role}</div>
                    <div className={styles.interviewMeta}>
                      <span>{interview.level}</span>
                      <span>{interview.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className={styles.chatArea}>
              {/* Animated Background */}
              <div className={styles.animatedBackground}>
                <div className={`${styles.blurCircle} ${styles.purple}`}></div>
                <div className={`${styles.blurCircle} ${styles.yellow}`}></div>
                <div className={`${styles.blurCircle} ${styles.pink}`}></div>
              </div>

              {/* Chat History */}
              <div
                className={`${styles.chatHistory} ${styles.customScrollbar}`}
              >
                <div className={styles.messagesContainer}>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`${styles.messageBubble} ${
                        msg.role === "user" ? styles.user : styles.assistant
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {isLoading && (
                    <div className={styles.typingIndicator}>
                      InterviewerAI đang gõ...
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              </div>

              {/* Input Area */}
              <div className={styles.inputContainer}>
                <div className={styles.inputForm}>
                  <form
                    onSubmit={handleSubmitMessage}
                    className={styles.inputWrapper}
                  >
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      placeholder="Type and press enter to start chatting..."
                      className={styles.chatInput}
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmitMessage(e);
                        }
                      }}
                    />
                    <div className={styles.inputActions}>
                      <div className={styles.leftActions}>
                        <button type="button" className={styles.actionButton}>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M7 1.00098V13.001"
                              stroke="currentColor"
                              strokeWidth="1.56"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M1 7H13"
                              stroke="currentColor"
                              strokeWidth="1.56"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className={styles.rightActions}>
                        <button type="button" className={styles.actionButton}>
                          <svg
                            width="11"
                            height="15"
                            viewBox="0 0 11 15"
                            fill="none"
                          >
                            <g opacity="0.8">
                              <path
                                d="M5.5 0.75C6.73979 0.75 7.75 1.76021 7.75 3V8C7.75 9.23979 6.73979 10.25 5.5 10.25C4.26021 10.25 3.25 9.23979 3.25 8V3C3.25 1.76021 4.26021 0.75 5.5 0.75Z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                              />
                              <path
                                d="M11 8C11 7.586 10.664 7.25 10.25 7.25C9.836 7.25 9.5 7.586 9.5 8C9.5 10.206 7.706 12 5.5 12C3.294 12 1.5 10.206 1.5 8C1.5 7.586 1.164 7.25 0.75 7.25C0.336 7.25 0 7.586 0 8C0 10.778 2.072 13.075 4.75 13.443V14.25C4.75 14.664 5.086 15 5.5 15C5.914 15 6.25 14.664 6.25 14.25V13.443C8.928 13.075 11 10.778 11 8Z"
                                fill="currentColor"
                              />
                            </g>
                          </svg>
                        </button>
                        <button
                          type="submit"
                          className={`${styles.actionButton} ${styles.sendButton}`}
                          disabled={isLoading || !currentMessage.trim()}
                        >
                          <svg
                            width="10"
                            height="14"
                            viewBox="0 0 10 14"
                            fill="none"
                          >
                            <path
                              d="M5.00098 12.335V1.66829"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9 5.66504L5 1.66504L1 5.66504"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeMiterlimit="10"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
