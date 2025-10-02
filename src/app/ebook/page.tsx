"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  FileText,
  Globe,
  Menu,
  Package,
  Shield,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

interface QuizQuestion {
  id: string;
  type: "true-false" | "multiple-choice";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
}

interface Section {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  quiz?: QuizQuestion;
}

export default function EbookPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<
    Record<string, string | string[]>
  >({});
  const [showQuizResults, setShowQuizResults] = useState<
    Record<string, boolean>
  >({});
  const [sectionCompleted, setSectionCompleted] = useState<
    Record<number, boolean>
  >({});
  const [lightboxImage, setLightboxImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  const handleSectionChange = (index: number) => {
    setCurrentSection(index);
    scrollToTop();
    setSidebarOpen(false);
  };

  // Check if a section is accessible (all previous sections completed)
  const isSectionAccessible = (index: number) => {
    if (index === 0) return true; // First section is always accessible

    // Check if all previous sections are completed
    for (let i = 0; i < index; i++) {
      if (!sectionCompleted[i]) {
        return false;
      }
    }
    return true;
  };

  const handleSectionNavigation = (index: number) => {
    if (isSectionAccessible(index)) {
      handleSectionChange(index);
    }
  };

  // Mark sections without quizzes as completed automatically
  useEffect(() => {
    const currentSectionData = sections[currentSection];
    if (currentSectionData && !currentSectionData.quiz) {
      setSectionCompleted((prev) => ({ ...prev, [currentSection]: true }));
    }
  }, [currentSection]);

  const handleQuizSubmit = (questionId: string, answer: string | string[]) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: answer }));
    setShowQuizResults((prev) => ({ ...prev, [questionId]: true }));

    // Find the current section's quiz
    const currentQuiz = sections[currentSection]?.quiz;
    if (currentQuiz && currentQuiz.id === questionId) {
      // Check if answer is correct
      const isCorrect = Array.isArray(currentQuiz.correctAnswer)
        ? Array.isArray(answer) &&
          currentQuiz.correctAnswer.length === answer.length &&
          currentQuiz.correctAnswer.every((ans) => answer.includes(ans))
        : answer === currentQuiz.correctAnswer;

      if (isCorrect) {
        setSectionCompleted((prev) => ({ ...prev, [currentSection]: true }));
      }
    }
  };

  const handleQuizReset = (questionId: string) => {
    setQuizAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
    setShowQuizResults((prev) => ({ ...prev, [questionId]: false }));
  };

  const openLightbox = (src: string, alt: string) => {
    setLightboxImage({ src, alt });
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const ClickableImage = ({
    src,
    alt,
    className = "",
    caption,
  }: {
    src: string;
    alt: string;
    className?: string;
    caption?: string;
  }) => (
    <div className="relative group">
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 border-2 border-transparent hover:border-blue-300 w-full max-w-full h-auto ${className}`}
        onClick={() => openLightbox(src, alt)}
      />
      <div
        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center cursor-pointer"
        onClick={() => openLightbox(src, alt)}
      >
        <div className="bg-white bg-opacity-90 px-2 py-1 rounded text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          Click to enlarge
        </div>
      </div>
      {caption && (
        <p className="text-xs sm:text-sm text-gray-600 text-center mt-2">
          {caption}
        </p>
      )}
    </div>
  );

  const QuizComponent = ({ quiz }: { quiz: QuizQuestion }) => {
    const userAnswer = quizAnswers[quiz.id];
    const showResult = showQuizResults[quiz.id];
    const isCorrect = Array.isArray(quiz.correctAnswer)
      ? Array.isArray(userAnswer) &&
        quiz.correctAnswer.length === userAnswer.length &&
        quiz.correctAnswer.every((ans) => userAnswer.includes(ans))
      : userAnswer === quiz.correctAnswer;

    return (
      <Card className="my-6 sm:my-8 border-2 border-blue-200 bg-blue-50">
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-blue-800 text-lg sm:text-xl">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6" />
            Knowledge Check
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4 sm:space-y-6">
            <p className="font-medium text-gray-900 text-base sm:text-lg leading-relaxed">
              {quiz.question}
            </p>

            {quiz.type === "true-false" ? (
              <div className="space-y-3 sm:space-y-4">
                {["True", "False"].map((option) => (
                  <label
                    key={option}
                    className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 min-h-[44px]"
                  >
                    <input
                      type="radio"
                      name={quiz.id}
                      value={option}
                      checked={userAnswer === option}
                      disabled={showResult}
                      onChange={(e) =>
                        setQuizAnswers((prev) => ({
                          ...prev,
                          [quiz.id]: e.target.value,
                        }))
                      }
                      className="text-blue-600 h-4 w-4 sm:h-5 sm:w-5"
                    />
                    <span className="text-base sm:text-lg font-medium text-gray-900">
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {quiz.options?.map((option, index) => (
                  <label
                    key={index}
                    className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 min-h-[44px]"
                  >
                    <input
                      type={
                        Array.isArray(quiz.correctAnswer) ? "checkbox" : "radio"
                      }
                      name={quiz.id}
                      value={String.fromCharCode(65 + index)} // A, B, C, D, etc.
                      checked={
                        Array.isArray(quiz.correctAnswer)
                          ? Array.isArray(userAnswer) &&
                            userAnswer.includes(String.fromCharCode(65 + index))
                          : userAnswer === String.fromCharCode(65 + index)
                      }
                      disabled={showResult}
                      onChange={(e) => {
                        if (Array.isArray(quiz.correctAnswer)) {
                          const currentAnswers = Array.isArray(userAnswer)
                            ? userAnswer
                            : [];
                          if (e.target.checked) {
                            setQuizAnswers((prev) => ({
                              ...prev,
                              [quiz.id]: [...currentAnswers, e.target.value],
                            }));
                          } else {
                            setQuizAnswers((prev) => ({
                              ...prev,
                              [quiz.id]: currentAnswers.filter(
                                (ans) => ans !== e.target.value,
                              ),
                            }));
                          }
                        } else {
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [quiz.id]: e.target.value,
                          }));
                        }
                      }}
                      className="text-blue-600 h-4 w-4 sm:h-5 sm:w-5 mt-1"
                    />
                    <span className="text-base sm:text-lg text-gray-900">
                      <span className="font-semibold">
                        {String.fromCharCode(65 + index)}.
                      </span>{" "}
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {!showResult && userAnswer && (
              <Button
                onClick={() => handleQuizSubmit(quiz.id, userAnswer)}
                className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto min-h-[44px] text-base sm:text-lg font-medium px-6 py-3"
              >
                Submit Answer
              </Button>
            )}

            {showResult && (
              <div
                className={`p-4 sm:p-6 rounded-lg ${isCorrect ? "bg-green-100 border border-green-300" : "bg-red-100 border border-red-300"}`}
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <CheckCircle
                    className={`h-5 w-5 sm:h-6 sm:w-6 ${isCorrect ? "text-green-600" : "text-red-600"}`}
                  />
                  <span
                    className={`font-medium text-base sm:text-lg ${isCorrect ? "text-green-800" : "text-red-800"}`}
                  >
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
                  {quiz.explanation}
                </p>
                {!isCorrect && (
                  <>
                    <p className="text-sm sm:text-base text-gray-600 mt-3 sm:mt-4">
                      <strong>Correct answer:</strong>{" "}
                      {Array.isArray(quiz.correctAnswer)
                        ? quiz.correctAnswer.join(", ")
                        : quiz.correctAnswer}
                    </p>
                    <Button
                      onClick={() => handleQuizReset(quiz.id)}
                      variant="outline"
                      className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      Try Again
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const sections: Section[] = [
    {
      id: "introduction",
      title: "Introduction & Overview",
      icon: BookOpen,
      content: (
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-4">
              Function-Specific HazMat Training
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 px-4">
              Handling, Packaging, and Shipping DOT-Regulated Materials
            </p>
            <Badge variant="outline" className="text-base sm:text-lg px-4 py-2">
              SpecChem Professional Training
            </Badge>
          </div>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                Welcome to SpecChem&apos;s Function-Specific Training
              </h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                This comprehensive training course covers the requirements and
                expectations for handling, packaging, and shipping DOT-regulated
                materials in your work at SpecChem.
              </p>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Why This Training Matters
                </h3>
                <p className="text-gray-700 mb-4">
                  <strong>Title 49 of the Code of Federal Regulations</strong>{" "}
                  requires that any associate who packages, handles, or
                  transports hazardous materials must undergo training every
                  three years regarding the following hazardous materials
                  subjects:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  {
                    title: "General Awareness",
                    desc: "Familiarization with various aspects involved with hazardous materials",
                  },
                  {
                    title: "Function-Specific Training",
                    desc: "How hazardous materials are handled in your specific job",
                  },
                  {
                    title: "Safety Training",
                    desc: "Safe handling of hazardous materials",
                  },
                  {
                    title: "Security Awareness",
                    desc: "Issues of HAZMAT security",
                  },
                  {
                    title: "In-Depth Security",
                    desc: "Detailed training on maintaining security when dealing with hazardous materials",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4"
                  >
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {index + 1}. {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Key Learning Outcomes
                </h3>
                <p className="text-gray-700 mb-4">
                  There are six things you should take away from this training:
                </p>
                <ul className="space-y-2 text-gray-700">
                  {[
                    "A basic understanding of what UN-rated packaging is",
                    "How you can find information on what packaging to use for specific materials and how to package it",
                    "A basic understanding of how to mark hazardous material for shipping",
                    "How to locate the proper labels for marking HAZ packaging",
                    "Where to find information on the required proper closure of HAZ packaging",
                    "Awareness of the proper tool to use when closing pails, drums, or totes, especially those which contain DOT-regulated materials",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },

    {
      id: "un-packaging-basics",
      title: "UN-Rated Packaging Fundamentals",
      icon: Package,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                Understanding UN-Rated Packaging
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-lg leading-relaxed text-gray-700">
                  You aren&apos;t expected to remember all the detailed
                  information, but should become aware of what sets the
                  packaging materials used for DOT-regulated materials apart
                  from standard packaging.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  What Makes UN-Rated Packaging Special?
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  UN ratings for packaging were developed so that transporting
                  hazardous materials would be both safer and easier. If a
                  material is DOT-regulated, it must be kept in UN-rated
                  packaging, either for storage or for transport.
                </p>

                {/* UN Packaging Codes Breakdown Image */}
                <div className="my-6">
                  <img
                    src="/images/safety/packaging-un-codes-breakdown.jpg"
                    alt="UN packaging codes breakdown showing the systematic identification of packaging materials with detailed explanations of each element"
                    className="w-full rounded-lg border border-gray-200 shadow-sm"
                  />
                  <p className="text-sm text-gray-600 mt-2 text-center">
                    UN packaging marking breakdown with element identification
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Shield className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Multi-faceted Rating
                    </h4>
                    <p className="text-sm text-gray-600">
                      Letters and numbers permanently marked on containers
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Rigorous Testing
                    </h4>
                    <p className="text-sm text-gray-600">
                      Series of tests to demonstrate conformity to standards
                    </p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <FileText className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">
                      DOT Enforcement
                    </h4>
                    <p className="text-sm text-gray-600">
                      U.S. Department of Transportation enforces regulations
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Comprehensive Testing Standards
                </h3>
                <p className="text-gray-700 mb-4">
                  The testing of packaging containers includes multiple rigorous
                  assessments:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    {
                      test: "External Pressure Testing",
                      purpose:
                        "Ensure containers can withstand changes in external pressure without failing",
                    },
                    {
                      test: "Internal Pressure Testing",
                      purpose:
                        "Ensure containers won&apos;t fail under conditions of internal pressure",
                    },
                    {
                      test: "Weight Bearing Testing",
                      purpose:
                        "Containers can bear weight for extended periods at high temperature without failing",
                    },
                    {
                      test: "Vibration Testing",
                      purpose:
                        "Containers can withstand vibrations which occur during transport",
                    },
                    {
                      test: "Drop Testing",
                      purpose:
                        "Containers can withstand freefall drops that may occur during transport",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded p-3"
                    >
                      <h4 className="font-medium text-gray-900 mb-1">
                        {item.test}
                      </h4>
                      <p className="text-sm text-gray-600">{item.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },

    {
      id: "when-un-required",
      title: "When UN-Rated Packaging is Required",
      icon: AlertTriangle,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                UN-Rated Packaging Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  When is UN-Rated Packaging Required?
                </h3>
                <p className="text-gray-700 mb-4">
                  UN-rated packaging is required if the material being packaged
                  for transport is classified as any of the following:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: "Explosive", emoji: "💥", class: "Class 1" },
                  {
                    type: "Non-flammable gas",
                    emoji: "🌬️",
                    class: "Class 2.2",
                  },
                  { type: "Flammable gas", emoji: "🔥", class: "Class 2.1" },
                  { type: "Flammable liquid", emoji: "🔥", class: "Class 3" },
                  {
                    type: "Infectious substance",
                    emoji: "🦠",
                    class: "Class 6.2",
                  },
                  { type: "Corrosive material", emoji: "⚠️", class: "Class 8" },
                  { type: "Flammable solid", emoji: "🔥", class: "Class 4.1" },
                  { type: "Oxidizer", emoji: "💨", class: "Class 5.1" },
                  { type: "Organic peroxide", emoji: "🧪", class: "Class 5.2" },
                  { type: "Toxic materials", emoji: "☠️", class: "Class 6.1" },
                  { type: "Radioactive", emoji: "☢️", class: "Class 7" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {item.type}
                    </h4>
                    <p className="text-xs text-gray-500">{item.class}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  SpecChem Common Materials
                </h3>
                <p className="text-gray-700 mb-4">
                  At SpecChem, the materials you will be handling which require
                  UN-rated packaging will be mostly:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      🔥 Flammable liquids
                    </h4>
                    <p className="text-sm text-gray-600">(Most common)</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ⚠️ Corrosives
                    </h4>
                    <p className="text-sm text-gray-600">
                      Chemical substances that cause damage
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ☠️ Toxic materials
                    </h4>
                    <p className="text-sm text-gray-600">
                      Harmful chemical substances
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      💨 Oxidizers
                    </h4>
                    <p className="text-sm text-gray-600">(Occasional use)</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">
                    Critical Rule - No Exceptions
                  </h3>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-3">
                  The most important takeaway from this training is:
                </p>
                <div className="bg-white border border-red-300 rounded p-4">
                  <p className="text-gray-700 font-medium">
                    Because UN-rated packaging is designed, tested, and
                    regulated to ensure the safest and most secure shipment and
                    storage of hazardous materials, it is{" "}
                    <strong>never acceptable</strong> to substitute non-UN-rated
                    packaging when working with materials classified as
                    hazardous. <strong>There are no exceptions.</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: "quiz-1",
        type: "true-false",
        question:
          "If you are packaging a DOT-regulated material and find that you do not have enough UN-rated containers to complete the run, you can substitute non-UN-rated containers as long as the number of non-UN-rated pails is less than 10% of the total being packaged.",
        correctAnswer: "False",
        explanation:
          "It is never allowable under any circumstance to package hazardous material in non-UN rated packaging. There are absolutely no exceptions to this rule.",
      },
    },

    {
      id: "responsibility-compliance",
      title: "Responsibility & Compliance",
      icon: Shield,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-600" />
                Understanding Responsibility & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                As a result, you must always pay attention to the type of
                packaging you are using for any material, so that DOT-regulated
                materials are packaged in the proper container, and that the
                container is properly closed.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    DOT Responsibility
                  </h3>
                  <p className="text-gray-700 mb-4">
                    We learned earlier that the DOT has responsibility for
                    ensuring compliance with regulations regarding handling and
                    transporting of hazardous materials.
                  </p>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-gray-600 font-medium">
                      U.S. Department of Transportation enforces all hazmat
                      regulations
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipper Responsibility
                  </h3>
                  <p className="text-gray-700 mb-4">
                    However, it is the responsibility of the{" "}
                    <strong>shipper</strong> to be sure that operations
                    involving DOT-regulated materials are in compliance.
                  </p>
                  <div className="space-y-2">
                    {[
                      "Packaging used must be authorized",
                      "Properly manufactured",
                      "Properly assembled",
                      "Properly marked",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-white rounded p-2"
                      >
                        <CheckCircle className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Our Responsibility
                </h3>
                <p className="text-gray-700 mb-4">
                  It is our responsibility,{" "}
                  <strong>both corporately and individually</strong>, to make
                  sure we are purchasing and using the proper packaging, and
                  that the material is properly identified for shipping.
                </p>

                <div className="bg-white border border-red-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-gray-900">
                      Consequence of Non-Compliance
                    </span>
                  </div>
                  <p className="text-gray-700">
                    <strong>
                      Failure to fulfill this responsibility can be costly.
                    </strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: "quiz-2",
        type: "multiple-choice",
        question:
          "Which one of the following statements is not true about UN-rated packaging?",
        options: [
          "UN ratings are required for the packaging used in shipment and storage of hazardous materials.",
          "Enforcement of current UN regulations is the responsibility of the Federal Bureau of Investigation, or FBI.",
          "A UN rating is a set of letters and numbers which specify what the particular container is regulated to hold.",
          "The packaging should be permanently marked on the bottom and either the side or the top.",
        ],
        correctAnswer: "B",
        explanation:
          "Enforcement of current UN regulations is actually the responsibility of the Department of Transportation (DOT), not the FBI.",
      },
    },

    {
      id: "information-sources",
      title: "Finding Information Sources",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-green-600" />
                Three Primary Information Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Now we will cover the three primary sources of information you
                can use to determine what packaging to use for any product.
              </p>

              <div className="grid lg:grid-cols-3 gap-6">
                {/* Source 1: Safety Data Sheet */}
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg text-gray-900">
                      1. Safety Data Sheet (SDS)
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Section 14 - Transport Information
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Identifies if material is DOT-regulated
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Required marking/labeling elements
                        </span>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-4">
                        <p className="text-xs text-gray-700">
                          <strong>Limitation:</strong> Shows regulation status
                          but not specific packaging type
                        </p>
                      </div>

                      {/* SDS Section 14 Example Images */}
                      <div className="mt-4 space-y-3">
                        <ClickableImage
                          src="/images/safety/info-sources-sds-section14-general.jpg"
                          alt="General SDS Section 14 transport information showing DOT, IATA, and IMDG classifications"
                          className="w-full rounded border border-gray-200"
                          caption="Example SDS Section 14 - Transport Information"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Source 2: Production Order */}
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg text-gray-900">
                      2. Production Order
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Verification Document
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Basic description of product
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Specific container type (e.g., &quot;blue steel UN
                          pail&quot;)
                        </span>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded p-3 mt-4">
                        <p className="text-xs text-gray-700">
                          <strong>Access:</strong> Request to view from
                          supervisor
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Source 3: Excel Files */}
                <Card className="border-2 border-blue-200">
                  <CardHeader className="bg-blue-50">
                    <CardTitle className="text-lg text-gray-900">
                      3. Excel Files on Server
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      Desktop Shortcuts → Packaging Folders
                    </p>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          Package type for all products
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">
                          UN-rating indicators
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700 font-semibold">
                          Proper closing instructions
                        </span>
                      </div>

                      {/* Excel Files Example Image */}
                      <div className="mt-4 space-y-3">
                        <ClickableImage
                          src="/images/safety/info-sources-excel-pails.jpg"
                          alt="Excel spreadsheet showing pail packaging specifications with color-coded entries and UN rating indicators"
                          className="w-full rounded border border-gray-200"
                          caption="Excel file showing pail packaging specifications"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Example Case Study */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 Case Study: CureNSeal 25EX
                </h3>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      SDS Section 14 Results:
                    </h4>
                    <div className="bg-white rounded p-3 border border-green-200">
                      <p className="text-sm text-gray-700 mb-2">
                        ✓ Identified as DOT-regulated per 49 CFR 172.01
                      </p>
                      <p className="text-sm text-gray-700">
                        ✓ Shows required marking elements
                      </p>
                    </div>

                    {/* CureNSeal SDS Image */}
                    <div className="mt-3">
                      <ClickableImage
                        src="/images/safety/info-sources-sds-section14-curennseal.jpg"
                        alt="CureNSeal 25EX SDS Section 14 showing DOT regulation classification and transport information"
                        className="w-full rounded border border-gray-200"
                        caption="CureNSeal 25EX SDS Section 14"
                      />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Excel File Results:
                    </h4>
                    <div className="bg-white rounded p-3 border border-green-200">
                      <p className="text-sm text-gray-700 mb-1">
                        • <strong>Pails:</strong> UN-rated blue steel pails
                      </p>
                      <p className="text-sm text-gray-700 mb-1">
                        • <strong>Drums:</strong> UN-rated blue steel drums
                      </p>
                      <p className="text-sm text-gray-700">
                        • <strong>Tools:</strong> Proper drum wrench
                        specifications
                      </p>
                    </div>

                    {/* CureNSeal Excel File Image */}
                    <div className="mt-3">
                      <ClickableImage
                        src="/images/safety/info-sources-excel-curennseal.jpg"
                        alt="Excel file entry for CureNSeal 25EX showing specific packaging requirements and UN rating indicators"
                        className="w-full rounded border border-gray-200"
                        caption="CureNSeal 25EX Excel file entry"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: "quiz-3",
        type: "multiple-choice",
        question:
          "Which are the three most common DOT-regulated materials in SpecChem products?",
        options: [
          "Explosives",
          "Flammable gas",
          "Flammable liquid",
          "Infectious substances",
          "Corrosives",
          "Toxic materials",
        ],
        correctAnswer: ["C", "E", "F"],
        explanation:
          "The three most common DOT-regulated materials at SpecChem are: Flammable liquid (most common), Corrosives, and Toxic materials.",
      },
    },

    {
      id: "information-sources-quiz",
      title: "Information Sources Quiz",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Information Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Let&apos;s test your understanding of the three primary
                information sources and their specific uses.
              </p>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: "quiz-4",
        type: "multiple-choice",
        question:
          "Which two sources show you the type of package to use when packaging a product?",
        options: [
          "Section 14 of the product SDS",
          "The production order",
          "An Excel file located on the corporate server specific to product packaged in drums or pails, respectively",
        ],
        correctAnswer: ["B", "C"],
        explanation:
          "The production order and the Excel file on the corporate server show the type of package to use. The SDS shows regulation status but not the specific package type.",
      },
    },

    {
      id: "closing-instructions-quiz",
      title: "Closing Instructions Source",
      icon: FileText,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Finding Closing Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Among the three information sources, only one provides the
                critical closing instructions needed for proper packaging.
              </p>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: "quiz-5",
        type: "multiple-choice",
        question:
          "Which one of those sources also lists the proper closing instructions for the packaging?",
        options: [
          "Section 14 of the product SDS",
          "The production order",
          "An Excel file located on the corporate server specific to product packaged in drums or pails, respectively",
        ],
        correctAnswer: "C",
        explanation:
          "Only the Excel file located on the corporate server contains the proper closing instructions for packaging. This is the most comprehensive source for packaging information.",
      },
    },

    {
      id: "package-marking",
      title: "Package Marking Requirements",
      icon: Package,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-indigo-600" />
                Proper Marking for DOT-Regulated Materials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Now we will cover information you need to know regarding proper
                marking for proper storage or transport of DOT-regulated
                materials.
              </p>

              {/* I-SHIP Acronym */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Remember: I-SHIP System
                </h3>
                <p className="text-gray-700 mb-4">
                  The basic description consists of four product characteristics
                  which give quick information on the type of hazard presented
                  by the material. As an aid in remembering the four
                  characteristics, think of the acronym <strong>I-SHIP</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      I
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Identification Number
                    </h4>
                    <p className="text-sm text-gray-600">
                      UN number identifying specific material/category
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      S
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Proper Shipping Name
                    </h4>
                    <p className="text-sm text-gray-600">
                      Describes hazard properties and composition
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      H
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Hazard Class
                    </h4>
                    <p className="text-sm text-gray-600">
                      Nine subdivisions describing hazard type
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      P
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Packing Group
                    </h4>
                    <p className="text-sm text-gray-600">
                      Danger level (lower number = higher danger)
                    </p>
                  </div>
                </div>
              </div>

              {/* CureNSeal Example */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📋 Example: CureNSeal 25EX Basic Description
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Identification
                    </h4>
                    <p className="text-2xl font-bold text-gray-700">UN 1139</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Shipping Name
                    </h4>
                    <p className="text-lg text-gray-700">Coating solution</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Hazard Class
                    </h4>
                    <p className="text-2xl font-bold text-gray-700">3</p>
                  </div>
                  <div className="bg-white rounded p-3 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      Packing Group
                    </h4>
                    <p className="text-2xl font-bold text-gray-700">2</p>
                  </div>
                </div>
              </div>

              {/* DOT Hazard Stickers */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  DOT Hazard Stickers
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      🔥 Class 3: Flammable Liquid
                    </h4>
                    <p className="text-gray-700 mb-2">
                      Square sticker using GHS pictograms
                    </p>
                    <p className="text-sm text-gray-600">
                      Most common at SpecChem
                    </p>

                    {/* Flammable Liquid Sticker Image */}
                    <div className="mt-3">
                      <ClickableImage
                        src="/images/safety/packaging-hazard-label-flammable.jpg"
                        alt="Class 3 Flammable Liquid hazard sticker with diamond shape and flame symbol"
                        className="w-32 mx-auto rounded border border-gray-200"
                      />
                    </div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      ⚠️ Class 8: Corrosive
                    </h4>
                    <p className="text-gray-700 mb-2">
                      Second most common sticker type
                    </p>
                    <p className="text-sm text-gray-600">
                      Pre-printed on continuous rolls
                    </p>

                    {/* Corrosive Sticker Image */}
                    <div className="mt-3">
                      <ClickableImage
                        src="/images/safety/packaging-hazard-label-corrosive.jpg"
                        alt="Class 8 Corrosive hazard sticker with diamond shape and corrosive symbol"
                        className="w-32 mx-auto rounded border border-gray-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <span className="font-semibold text-gray-900">
                      Inventory Management
                    </span>
                  </div>
                  <p className="text-gray-700">
                    If stock on a hazard sticker appears to be low, notify your
                    supervisor or lead immediately. Hazardous materials cannot
                    be shipped without these stickers.
                  </p>
                </div>
              </div>

              {/* UN Labels */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  UN Labels
                </h3>
                <p className="text-gray-700">
                  UN labels mark the packaging of DOT-regulated material with
                  the I-SHIP information. Files for printing labels are on the
                  corporate server in the same folder as product labels.
                </p>

                {/* UN Labels Sheet Image */}
                <div className="my-6">
                  <ClickableImage
                    src="/images/safety/packaging-un-labels-sheet.jpg"
                    alt="Sheet of UN1139 labels showing proper format with UN number, proper shipping name, and packing group information"
                    className="w-full max-w-md mx-auto rounded-lg border border-gray-200 shadow-sm"
                    caption="Example UN labels sheet for UN1139 (Coating Solution)"
                  />
                </div>

                {/* UN Label on Pail Example */}
                <div className="my-6">
                  <ClickableImage
                    src="/images/safety/packaging-un-label-on-pail.jpg"
                    alt="UN label properly placed on a pail showing correct positioning and size requirements"
                    className="w-full max-w-sm mx-auto rounded-lg border border-gray-200 shadow-sm"
                    caption="UN label properly placed on pail"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-semibold text-blue-800 mb-4">
                    Size Requirements (49 CFR Regulations)
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white rounded p-4 border border-blue-300">
                      <h5 className="font-semibold text-blue-700 mb-2">
                        🪣 Pails
                      </h5>
                      <p className="text-blue-600">
                        UN ID: Minimum <strong>6mm</strong> (0.24 inches)
                      </p>
                    </div>
                    <div className="bg-white rounded p-4 border border-blue-300">
                      <h5 className="font-semibold text-blue-700 mb-2">
                        🥁 Drums & Totes
                      </h5>
                      <p className="text-blue-600">
                        UN ID: Minimum <strong>12mm</strong> (0.47 inches)
                      </p>
                    </div>
                  </div>
                </div>

                {/* File Structure */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-800 mb-4">
                    📁 File Organization
                  </h4>
                  <div className="space-y-3">
                    <div className="bg-white rounded p-3 border border-gray-300">
                      <p className="font-medium text-gray-700">
                        S-Drive → Product Labels → UN Numbers
                      </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="bg-blue-100 rounded p-2 text-center">
                        <p className="font-medium text-blue-800">
                          Drums Folder
                        </p>
                      </div>
                      <div className="bg-green-100 rounded p-2 text-center">
                        <p className="font-medium text-green-800">
                          Pails Folder
                        </p>
                      </div>
                      <div className="bg-purple-100 rounded p-2 text-center">
                        <p className="font-medium text-purple-800">
                          Totes Folder
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticker Sheet Specifications */}
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Stickers per Sheet
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          ULINE Number
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left">
                          Avery Equivalent
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          12 per sheet
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          S5627
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Available
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          10 per sheet
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          S19321
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Available
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          6 per sheet
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          S19322
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Available
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Label Placement */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Label Placement Guidelines
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      🪣 Pails
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Position to the right of product label</li>
                      <li>• Don&apos;t obscure SpecChem logo</li>
                      <li>• UN label along bottom right of hazard sticker</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      🥁 Drums
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Similar to pails</li>
                      <li>• To the right of product label</li>
                      <li>• Same configuration as pails</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">
                      🏺 Totes
                    </h4>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>• Same configuration</li>
                      <li>• On side displaying product label</li>
                      <li>• Maintain visibility</li>
                    </ul>
                  </div>
                </div>

                {/* Label Placement Examples */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="text-center">
                    <ClickableImage
                      src="/images/safety/packaging-label-placement-pails.jpg"
                      alt="Proper label placement on pails showing correct positioning of hazard stickers and UN labels"
                      className="w-full rounded border border-gray-200 mb-2"
                      caption="Proper label placement on pails"
                    />
                  </div>
                  <div className="text-center">
                    <ClickableImage
                      src="/images/safety/packaging-label-placement-drums.jpg"
                      alt="Proper label placement on drums showing correct positioning of hazard stickers and UN labels"
                      className="w-full rounded border border-gray-200 mb-2"
                      caption="Proper label placement on drums"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: "quiz-6",
        type: "true-false",
        question:
          "If you forget to mark pails of DOT-regulated material with the DOT hazard sticker and/or UN label, it's okay to allow them to ship as long as you put a note on the shipping paperwork.",
        correctAnswer: "False",
        explanation:
          "All packages containing hazardous material must be marked properly or they cannot be placed on a truck for shipment. Improperly marked packages should be removed from staging immediately and corrected before shipping.",
      },
    },

    {
      id: "proper-closure",
      title: "Proper Closure Procedures",
      icon: Shield,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-red-600" />
                Proper Closure of Packaging Containers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Critical for All Products
                  </h3>
                </div>
                <p className="text-gray-700 mb-3">
                  Proper closure of packaging is{" "}
                  <strong>key to preventing the possibility of leaks</strong>,
                  so adhering to proper closing instructions is vital when
                  handling DOT-regulated materials.
                </p>
                <p className="text-gray-700">
                  Since we don&apos;t want to ship packaging of any type which
                  may have the possibility of leaking, proper closing
                  instructions should be followed for{" "}
                  <strong>all SpecChem products</strong> - DOT-regulated or not.
                </p>
              </div>

              {/* DRUM CLOSURE SECTION */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  🥁 Drum Closure Procedures
                </h3>

                {/* Drum Types and Torque Requirements */}
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-300 rounded-lg bg-white">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-4 py-3 text-left">
                          Drum Type
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left">
                          Bung Size
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left">
                          Bung Material
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left">
                          Required Torque
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          Steel drums
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          2-inch
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Steel bung
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-bold text-blue-600">
                          30 foot-pounds
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          Steel drums
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          3/4-inch
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Steel bung
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-bold text-blue-600">
                          15 foot-pounds
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          Steel drums
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          2-inch
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Poly bung
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-bold text-green-600">
                          20 foot-pounds
                        </td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">
                          Steel drums
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          3/4-inch
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Poly bung
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-bold text-green-600">
                          9 foot-pounds
                        </td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-2">
                          Poly drums
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-medium">
                          2-inch
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          Poly bung
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-bold text-green-600">
                          20 foot-pounds
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Torque Wrenches */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-2 border-red-200">
                    <CardHeader className="bg-red-50">
                      <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                        🔴 Red Handle Drum Wrench
                        <Badge
                          variant="outline"
                          className="text-red-600 border-red-300"
                        >
                          Steel Bungs
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="bg-white border border-red-200 rounded p-3">
                          <h5 className="font-semibold text-red-700 mb-1">
                            Large 4-lug side
                          </h5>
                          <p className="text-red-600">
                            30 foot-pounds (2-inch steel bungs)
                          </p>
                        </div>
                        <div className="bg-white border border-red-200 rounded p-3">
                          <h5 className="font-semibold text-red-700 mb-1">
                            Single lug side
                          </h5>
                          <p className="text-red-600">
                            15 foot-pounds (3/4-inch steel bungs)
                          </p>
                        </div>
                      </div>

                      {/* Red Drum Wrench Image */}
                      <div className="mt-4">
                        <ClickableImage
                          src="/images/safety/closure-drum-wrench-red.jpg"
                          alt="Red handle drum wrench tool for steel bungs showing proper torque specifications"
                          className="w-full rounded border border-gray-200"
                          caption="Red handle wrench for steel bungs"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-yellow-200">
                    <CardHeader className="bg-yellow-50">
                      <CardTitle className="text-lg text-yellow-800 flex items-center gap-2">
                        🟡 Yellow Handle Drum Wrench
                        <Badge
                          variant="outline"
                          className="text-yellow-600 border-yellow-300"
                        >
                          Poly Bungs
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="bg-white border border-yellow-200 rounded p-3">
                          <h5 className="font-semibold text-yellow-700 mb-1">
                            Large 4-lug side
                          </h5>
                          <p className="text-yellow-600">
                            20 foot-pounds (2-inch poly bungs)
                          </p>
                        </div>
                        <div className="bg-white border border-yellow-200 rounded p-3">
                          <h5 className="font-semibold text-yellow-700 mb-1">
                            Single lug side
                          </h5>
                          <p className="text-yellow-600">
                            9 foot-pounds (3/4-inch poly bungs)
                          </p>
                        </div>
                      </div>

                      {/* Yellow Drum Wrench Image */}
                      <div className="mt-4">
                        <ClickableImage
                          src="/images/safety/closure-drum-wrench-yellow.jpg"
                          alt="Yellow handle drum wrench tool for poly bungs showing proper torque specifications"
                          className="w-full rounded border border-gray-200"
                          caption="Yellow handle wrench for poly bungs"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Drum Types Images */}
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <ClickableImage
                      src="/images/safety/closure-drum-steel-bungs.jpg"
                      alt="Steel drum with steel bungs showing proper closure configuration"
                      className="w-full rounded border border-gray-200 mb-2"
                      caption="Steel drum with steel bungs"
                    />
                  </div>
                  <div className="text-center">
                    <ClickableImage
                      src="/images/safety/closure-drum-poly-bungs.jpg"
                      alt="Steel drum with poly bungs showing proper closure configuration"
                      className="w-full rounded border border-gray-200 mb-2"
                      caption="Steel drum with poly bungs"
                    />
                  </div>
                  <div className="text-center">
                    <ClickableImage
                      src="/images/safety/closure-drum-poly-container.jpg"
                      alt="Poly drum container showing proper closure requirements"
                      className="w-full rounded border border-gray-200 mb-2"
                      caption="Poly drum container"
                    />
                  </div>
                </div>

                {/* Sealed Drum Example */}
                <div className="text-center mt-6">
                  <ClickableImage
                    src="/images/safety/closure-drum-example-sealed.jpg"
                    alt="Properly sealed drum showing correct closure technique and final appearance"
                    className="w-full max-w-md mx-auto rounded border border-gray-200"
                    caption="Example of properly sealed drum"
                  />
                </div>

                <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <h4 className="text-xl font-bold text-gray-900">
                      Absolute Requirement
                    </h4>
                  </div>
                  <p className="text-gray-700 text-lg">
                    When packaging products classified as HAZ, these are the{" "}
                    <strong>only tools</strong> which may be used to close
                    drums. <strong>There are absolutely no exceptions.</strong>
                  </p>
                </div>
              </div>

              {/* PAIL CLOSURE SECTION */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  🪣 Pail Closure Procedures
                </h3>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="border-2 border-blue-200">
                    <CardHeader className="bg-blue-50 text-center">
                      <CardTitle className="text-blue-800">Step 1</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold text-blue-700 mb-2">
                        Place the Lid
                      </h4>
                      <p className="text-blue-600 text-sm mb-3">
                        Place the uncrimped lid on top of the pail.
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                        <p className="text-xs text-yellow-700">
                          <strong>Spouted lid:</strong> Orient spout opposite
                          product label to prevent damage
                        </p>
                      </div>

                      {/* Step 1 Image */}
                      <div className="mt-3">
                        <ClickableImage
                          src="/images/safety/closure-pail-lid-placement.jpg"
                          alt="Pail with lid properly placed showing correct orientation and positioning"
                          className="w-full rounded border border-gray-200"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-green-200">
                    <CardHeader className="bg-green-50 text-center">
                      <CardTitle className="text-green-800">Step 2</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold text-green-700 mb-2">
                        Align Crimper
                      </h4>
                      <p className="text-green-600 text-sm mb-3">
                        Place the crimper over the lid.
                      </p>
                      <div className="bg-green-100 border border-green-300 rounded p-2">
                        <p className="text-xs text-green-700">
                          <strong>Critical:</strong> Align 16 lugs on crimper
                          with 16 tabs on lid
                        </p>
                      </div>

                      {/* Step 2 Image */}
                      <div className="mt-3">
                        <ClickableImage
                          src="/images/safety/closure-pail-crimper-tool.jpg"
                          alt="Pail crimper tool properly positioned over lid showing alignment of lugs and tabs"
                          className="w-full rounded border border-gray-200"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-purple-200">
                    <CardHeader className="bg-purple-50 text-center">
                      <CardTitle className="text-purple-800">Step 3</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <h4 className="font-semibold text-purple-700 mb-2">
                        Crimp
                      </h4>
                      <p className="text-purple-600 text-sm mb-3">
                        Press down on crimper handles.
                      </p>
                      <div className="bg-purple-100 border border-purple-300 rounded p-2">
                        <p className="text-xs text-purple-700">
                          Apply firm, even pressure until handles reach end of
                          motion
                        </p>
                      </div>

                      {/* Step 3 Result Image */}
                      <div className="mt-3">
                        <ClickableImage
                          src="/images/safety/closure-pail-example-sealed.jpg"
                          alt="Properly sealed pail showing completed crimping and final appearance"
                          className="w-full rounded border border-gray-200"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h4 className="font-semibold text-gray-900">
                      Alignment is Critical
                    </h4>
                  </div>
                  <p className="text-gray-700">
                    If the lugs are set over the gap between tabs, the tab will
                    not be fully crimped and may not be tight enough against the
                    pail body, which could allow for seepage or leakage.
                  </p>
                </div>
              </div>

              {/* TOTE CLOSURE SECTION */}
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  🏺 Tote Closure Procedures
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <p className="text-blue-700 mb-4">
                    There is no single torque value for all tote lids. In most
                    cases, totes are manufactured by Mauser and require{" "}
                    <strong>70 foot-pounds</strong> of torque.
                  </p>

                  <div className="bg-white border border-blue-300 rounded p-4 mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      📁 Verification Path
                    </h4>
                    <p className="text-blue-600 text-sm">
                      Desktop → S: → Operations → Compliance → Closing
                      Instructions → &quot;IBC Closing Instructions
                      totes.pdf&quot;
                    </p>
                  </div>

                  <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                    <p className="text-yellow-700 text-sm">
                      <strong>Unknown manufacturer?</strong> Ask your plant
                      manager to contact purchasing lead for guidance.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Required Tools
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-700">1.</span>
                        <div>
                          <p className="font-medium text-gray-800">
                            IBC/Tote Wrench
                          </p>
                          <p className="text-sm text-gray-600">
                            Circular ring with handles and square center hole
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <span className="font-medium text-gray-700">2.</span>
                        <div>
                          <p className="font-medium text-gray-800">
                            Socket Torque Wrench
                          </p>
                          <p className="text-sm text-gray-600">
                            Standard 1½ inch drive
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tote Wrenches Image */}
                    <div className="mt-4">
                      <ClickableImage
                        src="/images/safety/closure-tote-wrenches.png"
                        alt="Tote closure wrenches showing IBC wrench and socket torque wrench tools"
                        className="w-full rounded border border-gray-200"
                        caption="Tote closure tools"
                      />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Four-Step Process
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-blue-600">1.</span>
                        <span>Place tote wrench over lid</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-blue-600">2.</span>
                        <span>
                          Set dial to desired torque (usually 70 ft-lbs)
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-blue-600">3.</span>
                        <span>Insert socket head into square hole</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-bold text-blue-600">4.</span>
                        <span>Turn until handle breaks/bends</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: "quiz-7",
        type: "true-false",
        question:
          "All drums, whether made of steel or plastic, require the same amount of torque to be considered properly closed.",
        correctAnswer: "False",
        explanation:
          "The amount of torque is different depending on the size of the bung and the type of material. 2-inch steel bungs require 30 foot-pounds, 3/4-inch steel bungs require 15 foot-pounds, 2-inch poly bungs require 20 foot-pounds, and 3/4-inch poly bungs require 9 foot-pounds.",
      },
    },

    {
      id: "final-quiz",
      title: "Final Knowledge Check",
      icon: CheckCircle,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Final Compliance Question
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                This final question addresses the most critical safety
                requirement when working with DOT-regulated materials.
              </p>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: "quiz-8",
        type: "true-false",
        question:
          "When packaging DOT-regulated material in drums, it is never allowable to use a closure tool other than the drum torque wrench specific to the type of bungs used to close the drum (red for steel bungs and yellow for poly or plastic bungs).",
        correctAnswer: "True",
        explanation:
          "Properly calibrated torque wrenches are the only tool allowable for use in closing drums containing DOT-regulated material and should also be used for non-DOT-regulated material to ensure proper seal. Using the proper torque wrench is the best defense against potential leakage.",
      },
    },

    {
      id: "course-summary",
      title: "Course Summary & Completion",
      icon: CheckCircle,
      content: (
        <div className="space-y-6 sm:space-y-8">
          <div className="text-center py-8 sm:py-12 bg-green-50 rounded-xl">
            <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-4">
              Course Complete!
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 px-4">
              You have successfully completed the Function-Specific HazMat
              Training
            </p>
            <Badge
              variant="outline"
              className="text-base sm:text-lg px-4 sm:px-6 py-3 bg-green-100 border-green-300 text-gray-900"
            >
              SpecChem Certified
            </Badge>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">
                What You&apos;ve Learned
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                As we come to the end of this course, here are the key
                competencies you have acquired:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: "📦",
                    title: "UN-Rated Packaging",
                    desc: "Understanding what it means, what it is, and why it's used",
                  },
                  {
                    icon: "🔍",
                    title: "Information Sources",
                    desc: "Where to find specific information on pail or drum types for any liquid product",
                  },
                  {
                    icon: "🏷️",
                    title: "Proper Markings",
                    desc: "How to properly mark hazardous materials for shipping",
                  },
                  {
                    icon: "📋",
                    title: "Required Marking Info",
                    desc: "Where to find information on required marking for hazardous materials",
                  },
                  {
                    icon: "🔒",
                    title: "Closing Instructions",
                    desc: "Where to find closing instructions for each type of packaging",
                  },
                  {
                    icon: "🔧",
                    title: "Proper Tools",
                    desc: "The proper tools for closing pails, drums, and totes with DOT-regulated materials",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{item.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Takeaway
                </h3>
                <p className="text-gray-700 text-lg">
                  The most important outcome of this training is not a quiz
                  score, but having you know the{" "}
                  <strong>
                    proper procedures for handling hazardous materials
                  </strong>{" "}
                  in your work at SpecChem.
                </p>
              </div>

              {/* Emergency Protocol Reminder */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🚨 Emergency Protocol Reminder
                </h3>
                <p className="text-gray-700 mb-4">
                  If you discover improperly marked packages containing
                  hazardous material:
                </p>
                <div className="space-y-2">
                  {[
                    "Immediately notify your lead, supervisor, plant manager, or assistant plant manager",
                    "Remove pallets from staging or storage lanes",
                    "Unband or unwrap packages to prevent truck loading",
                    "Correct package markings as soon as possible",
                    "Return pallets to staging only after proper marking",
                  ].map((step, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="font-bold text-red-600 text-sm">
                        {index + 1}.
                      </span>
                      <span className="text-gray-700 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completion Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📝 Next Steps
                </h3>
                <p className="text-gray-700">
                  <strong>
                    Please provide your signed and dated quiz results to your
                    plant manager.
                  </strong>
                </p>
                <div className="mt-4 p-3 bg-white border border-gray-200 rounded">
                  <p className="text-sm text-gray-600">
                    This training satisfies the federal requirement for
                    function-specific hazardous materials training and is valid
                    for three years from the completion date.
                  </p>
                </div>
              </div>

              <div className="text-center pt-8">
                <p className="text-gray-600">
                  Thank you for completing this training.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Document Version: 2024 (Summer) • Regulatory Authority: 49 CFR
                  • Enforcement: U.S. DOT
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  const progress =
    (Object.keys(sectionCompleted).filter(
      (key) => sectionCompleted[parseInt(key)],
    ).length /
      sections.length) *
    100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Progress */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label={
                  sidebarOpen ? "Close navigation" : "Open navigation"
                }
              >
                {sidebarOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </Button>
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate">
                    Function-Specific HazMat Training
                  </h1>
                  <div className="hidden sm:block">
                    <p className="text-xs sm:text-sm text-gray-500">
                      Interactive Learning Module
                    </p>
                  </div>
                  {/* Mobile Progress Bar */}
                  <div className="sm:hidden flex items-center gap-2 mt-1">
                    <Progress
                      value={progress}
                      className="h-1.5 flex-1 max-w-[120px]"
                    />
                    <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                      {Math.round(progress)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              {/* Desktop Progress Bar */}
              <div className="hidden sm:flex items-center gap-2">
                <Progress value={progress} className="h-2 w-32 lg:w-48" />
                <span className="text-sm text-gray-600 font-medium whitespace-nowrap">
                  {Math.round(progress)}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                <select
                  className="text-xs sm:text-sm border border-gray-300 rounded px-1 sm:px-2 py-1 bg-white min-w-[60px]"
                  onChange={(e) => {
                    if (e.target.value === "es") {
                      router.push("/ebook-spanish");
                    }
                  }}
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>

              <div className="hidden lg:block text-sm text-gray-600">
                Section {currentSection + 1} of {sections.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto relative">
        {/* Sidebar */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:sticky top-12 sm:top-16 left-0 z-30 w-full max-w-sm sm:w-80 h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto shadow-lg lg:shadow-none`}
        >
          {/* Mobile Close Button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              Table of Contents
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4 sm:p-6">
            <h2 className="hidden lg:block text-lg font-semibold text-gray-900 mb-6">
              Table of Contents
            </h2>
            <nav className="space-y-1 sm:space-y-2">
              {sections.map((section, index) => {
                const isAccessible = isSectionAccessible(index);
                const isCompleted = sectionCompleted[index];

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionNavigation(index)}
                    disabled={!isAccessible}
                    className={`w-full text-left p-3 sm:p-3 rounded-lg transition-colors min-h-[44px] ${
                      currentSection === index
                        ? "bg-blue-100 text-blue-800 border-l-4 border-blue-500"
                        : isAccessible
                          ? "text-gray-700 hover:bg-gray-50 active:bg-gray-100"
                          : "text-gray-400 cursor-not-allowed opacity-60"
                    }`}
                    title={
                      !isAccessible
                        ? "Complete previous sections to unlock"
                        : ""
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0">
                        <section.icon
                          className={`h-5 w-5 ${
                            currentSection === index
                              ? "text-blue-600"
                              : isAccessible
                                ? "text-gray-400"
                                : "text-gray-300"
                          }`}
                        />
                        {isCompleted && (
                          <CheckCircle className="h-3 w-3 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
                        )}
                        {!isAccessible && index > 0 && (
                          <div className="h-3 w-3 bg-gray-300 rounded-full absolute -top-1 -right-1 flex items-center justify-center">
                            <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-sm sm:text-base leading-tight">
                          {section.title}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 mt-1">
                          Section {index + 1}
                          {isCompleted && (
                            <span className="text-green-600 ml-1">✓</span>
                          )}
                          {!isAccessible && index > 0 && (
                            <span className="text-gray-400 ml-1">🔒</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base">
                Study Progress
              </h3>
              <Progress value={progress} className="mb-2 h-2" />
              <p className="text-xs sm:text-sm text-blue-600">
                {Math.round(progress)}% Complete
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Section {currentSection + 1} of {sections.length}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50 top-12 sm:top-16"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation overlay"
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 min-w-0">
          <div
            ref={contentRef}
            className="h-[calc(100vh-3rem)] sm:h-[calc(100vh-4rem)] overflow-y-auto p-4 sm:p-6 lg:p-12"
          >
            <div className="max-w-4xl mx-auto">
              {sections[currentSection]?.content}

              {sections[currentSection]?.quiz ? (
                <QuizComponent quiz={sections[currentSection]?.quiz!} />
              ) : null}

              {/* Navigation */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200 gap-4 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() =>
                    handleSectionChange(Math.max(0, currentSection - 1))
                  }
                  disabled={currentSection === 0}
                  className="flex items-center gap-2 min-h-[44px] min-w-[100px] w-full sm:w-auto"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="text-center order-first sm:order-none">
                  <p className="text-sm text-gray-500">
                    Section {currentSection + 1} of {sections.length}
                  </p>
                  {sections[currentSection]?.quiz &&
                    !sectionCompleted[currentSection] && (
                      <p className="text-xs text-amber-600 mt-1">
                        Complete the quiz to continue
                      </p>
                    )}
                </div>

                <Button
                  onClick={() =>
                    handleSectionChange(
                      Math.min(sections.length - 1, currentSection + 1),
                    )
                  }
                  disabled={
                    currentSection === sections.length - 1 ||
                    !sectionCompleted[currentSection]
                  }
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px] min-w-[100px] w-full sm:w-auto"
                  title={
                    !sectionCompleted[currentSection]
                      ? "Complete the current section to continue"
                      : ""
                  }
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-7xl max-h-[95vh] sm:max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={lightboxImage.src}
              alt={lightboxImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeLightbox}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 sm:p-3 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-black bg-opacity-50 text-white p-2 sm:p-3 rounded-lg">
              <p className="text-xs sm:text-sm">{lightboxImage.alt}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
