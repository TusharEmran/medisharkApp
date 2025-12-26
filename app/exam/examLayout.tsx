import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import ExamExitConfirmModal from '../../components/ui/ExamExitConfirmModal';
import { useTheme } from '../theme/ThemeContext';
import { Colors } from '../../constants/theme';

type QuestionType = 'single' | 'multiple';

type Question = {
  id: number;
  text: string;
  type: QuestionType;
  options?: string[];
};

type ExamData = {
  title: string;
  duration: number;
  totalQuestions: number;
  passingScore: number;
  questions: Question[];
};

type AnswerValue = number | number[];

type AnswersState = Record<number, AnswerValue>;

const EXAM_DATA: ExamData = {
  title: 'React Native Certification Exam',
  duration: 60,
  totalQuestions: 4,
  passingScore: 70,
  questions: [
    {
      id: 1,
      text: "What is the main advantage of using FlatList over ScrollView for long lists?",
      options: [
        'A. Better animation support',
        'B. Memory efficiency and performance',
        'C. Built-in pagination',
        'D. Automatic sorting',
      ],
      type: 'single',
    },
    {
      id: 2,
      text: 'Which of the following are React Native core components? (Select all that apply)',
      options: ['A. View', 'B. Text', 'C. Div', 'D. StyleSheet', 'E. Image'],
      type: 'multiple',
    },
    {
      id: 3,
      text: "What does the 'flex' property determine in React Native layouts?",
      options: [
        'A. Text font size',
        'B. Element opacity',
        'C. Space distribution among siblings',
        'D. Border thickness',
      ],
      type: 'single',
    },
    {
      id: 4,
      text: 'Which hooks are built into React? (Select all that apply)',
      options: ['A. useState', 'B. useEffect', 'C. useNative', 'D. useCallback', 'E. useStorage'],
      type: 'multiple',
    },
  ],
};

const TOTAL_SECONDS = 3600;
const { width, height } = Dimensions.get('window');
const QUESTION_ITEM_SIZE = 40;

export default function ExamScreen() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  const palette = isDarkMode ? Colors.dark : Colors.light;
  const [currentQuestionId, setCurrentQuestionId] = useState<number>(1);
  const [answers, setAnswers] = useState<AnswersState>({});
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SECONDS);
  const [showSubmit, setShowSubmit] = useState<boolean>(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState<boolean>(false);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const questions = EXAM_DATA.questions;
  const currentQuestion = questions.find(q => q.id === currentQuestionId) || questions[0];

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((t: number) => {
        if (t <= 1) {
          clearInterval(id);
          setShowSubmit(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        setShowExitModal(true);
        return true; // prevent default back behavior
      };

      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [])
  );

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [currentQuestionId]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleConfirmExit = () => {
    setShowExitModal(false);
    router.back();
  };

  const handleCancelExit = () => {
    setShowExitModal(false);
  };

  const handleSelect = (qid: number, opt: AnswerValue) => {
    setAnswers((prev: AnswersState) => ({ ...prev, [qid]: opt }));
  };

  const getQuestionStatus = (questionId: number) => {
    if (questionId === currentQuestionId) return 'current';
    if (answers[questionId] !== undefined) return 'answered';
    return 'unanswered';
  };

  const scrollToQuestion = (questionId: number) => {
    setCurrentQuestionId(questionId);
    if (showQuestionsModal) {
      setShowQuestionsModal(false);
    }

    const questionIndex = questions.findIndex(q => q.id === questionId);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: questionIndex * (height * 0.7),
        animated: true
      });
    }
  };

  const renderQuestionNumberGrid = () => {
    return (
      <View style={s.questionsGrid}>
        {questions.map((question) => {
          const status = getQuestionStatus(question.id);
          return (
            <TouchableOpacity
              key={question.id}
              style={[
                s.questionNumberBtn,
                status === 'current' && s.questionNumberCurrent,
                status === 'answered' && s.questionNumberAnswered,
                status === 'unanswered' && s.questionNumberUnanswered,
              ]}
              onPress={() => scrollToQuestion(question.id)}
            >
              <Text style={[
                s.questionNumberText,
                status === 'current' && s.questionNumberTextCurrent,
                status === 'answered' && s.questionNumberTextAnswered
              ]}>
                {question.id}
              </Text>

              {status === 'answered' && (
                <MaterialIcons
                  name="check-circle"
                  size={12}
                  color="#10b981"
                  style={s.questionNumberIcon}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderAllQuestions = () => {
    return (
      <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false}>
        {questions.map((question) => (
          <Animated.View
            key={question.id}
            style={[
              s.questionCard,
              { backgroundColor: palette.cardBackground },
              { opacity: question.id === currentQuestionId ? 1 : fadeAnim },
            ]}
          >
            <View style={s.questionCardHeader}>
              <Text style={[s.questionCardNumber, { color: palette.text }]}>Question {question.id}</Text>

              <View
                style={[
                  s.questionTypeTag,
                  question.type === 'single' && s.questionTypeSingle,
                  question.type === 'multiple' && s.questionTypeMultiple,
                ]}
              >
                <Text style={[s.questionTypeTagText, { color: palette.text }]}>
                  {question.type.charAt(0).toUpperCase() + question.type.slice(1)}
                </Text>
              </View>
            </View>

            <Text style={[s.questionCardText, { color: palette.surfaceDarkText }]}>{question.text}</Text>
            {question.type === 'single' && question.options && (
              <View style={s.optionsContainer}>
                {question.options.map((op, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[
                      s.optionCard,
                      { backgroundColor: palette.cardBackgroundSoft, borderColor: palette.borderSubtle },
                      answers[question.id] === i && { backgroundColor: palette.primary, borderColor: palette.primary }
                    ]}
                    onPress={() => {
                      if (answers[question.id] !== undefined) return;

                      handleSelect(question.id, i);
                    }}
                  >
                    <View style={s.optionRadio}>
                      {answers[question.id] === i && (
                        <View style={s.optionRadioSelected} />
                      )}
                    </View>
                    <Text style={[s.optionCardText, { color: palette.surfaceDarkText }]}>{op}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* MULTIPLE TYPE */}
            {question.type === 'multiple' && question.options && (
              <View style={s.optionsContainer}>
                {question.options.map((op, i) => {
                  const current = answers[question.id] as number[] | undefined;
                  const sel = current || [];
                  const isSel = sel.includes(i);
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        s.optionCard,
                        { backgroundColor: palette.cardBackgroundSoft, borderColor: palette.borderSubtle },
                        isSel && { backgroundColor: palette.primary, borderColor: palette.primary }
                      ]}
                      onPress={() => {
                        const arr = isSel
                          ? sel.filter((x: number) => x !== i)
                          : [...sel, i];
                        handleSelect(question.id, arr);
                      }}
                    >
                      <View
                        style={[
                          s.optionCheckbox,
                          isSel && s.optionCheckboxSelected
                        ]}
                      >
                        {isSel && (
                          <MaterialIcons name="check" size={14} color="white" />
                        )}
                      </View>
                      <Text style={[s.optionCardText, { color: palette.surfaceDarkText }]}>{op}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            <View style={s.questionDivider} />
          </Animated.View>
        ))}
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[s.container, { backgroundColor: palette.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={[s.container, { backgroundColor: palette.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={palette.tabBackground} />

        {/* HEADER */}
        <View style={[s.header, { backgroundColor: palette.tabBackground }]}>
          <View style={s.headerMain}>
            <Text style={[s.title, { color: palette.surfaceDarkText }]} numberOfLines={2}>{EXAM_DATA.title}</Text>

            <View style={s.headerRight}>
              <View style={[s.timerContainer, { backgroundColor: palette.cardBackgroundSoft }]}>
                <MaterialIcons name="access-time" size={18} color={palette.mutedText} />
                <Text style={[s.timer, { color: palette.mutedText }]}>{formatTime(timeLeft)}</Text>
              </View>

              <TouchableOpacity
                style={s.menuBtn}
                onPress={() => setShowQuestionsModal(true)}
              >
                <MaterialIcons name="menu" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.progressContainer}>
            <View style={s.progressBar}>
              <View
                style={[
                  s.progressFill,
                  { width: `${(Object.keys(answers).length / questions.length) * 100}%` }
                ]}
              />
            </View>

            <View style={s.progressInfo}>
              <Text style={[s.progressText, { color: palette.mutedText }]}>
                {Object.keys(answers).length} / {questions.length} answered
              </Text>

            </View>
          </View>
        </View>


        {/* MAIN CONTENT */}
        {renderAllQuestions()}

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          style={s.submitButton}
          onPress={() => setShowSubmit(true)}
        >
          <Text style={s.submitButtonText}>Submit Exam</Text>
        </TouchableOpacity>

        <ExamExitConfirmModal
          visible={showExitModal}
          onConfirm={handleConfirmExit}
          onCancel={handleCancelExit}
        />

        {/* QUESTIONS MODAL */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showQuestionsModal}
          onRequestClose={() => setShowQuestionsModal(false)}
        >
          <View style={s.modalContainer}>
            <View style={s.modalContent}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>All Questions</Text>
                <TouchableOpacity
                  onPress={() => setShowQuestionsModal(false)}
                  style={s.modalCloseBtn}
                >
                  <MaterialIcons name="close" size={24} color="#0f1724" />
                </TouchableOpacity>
              </View>

              <View style={s.modalGrid}>
                {renderQuestionNumberGrid()}
              </View>

              <View style={s.modalStats}>
                <View style={s.modalStat}>
                  <View style={[s.modalStatDot, s.modalStatCurrent]} />
                  <Text style={s.modalStatText}>Current</Text>
                </View>

                <View style={s.modalStat}>
                  <View style={[s.modalStatDot, s.modalStatAnswered]} />
                  <Text style={s.modalStatText}>Answered</Text>
                </View>

                <View style={s.modalStat}>
                  <View style={[s.modalStatDot, s.modalStatUnanswered]} />
                  <Text style={s.modalStatText}>Unanswered</Text>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    backgroundColor: Colors.light.tabBackground,
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 12,
  },
  headerMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBackgroundSoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  timer: {
    color: Colors.light.mutedText,
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 14,
  },
  menuBtn: {
    padding: 4,
  },
  progressContainer: {
    marginTop: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.light.borderSubtle,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 3,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  progressText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  reviewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  reviewBtnText: {
    color: '#9ca3af',
    fontSize: 12,
    fontWeight: '500',
  },
  questionsBanner: {
    backgroundColor: Colors.light.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 12,
  },
  questionsBannerContent: {
    paddingHorizontal: 16,
  },
  questionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  questionNumberBtn: {
    width: QUESTION_ITEM_SIZE,
    height: QUESTION_ITEM_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    margin: 4,
    borderWidth: 1,
  },
  questionNumberCurrent: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  questionNumberAnswered: {
    backgroundColor: Colors.light.accentTealSoft,
    borderColor: Colors.light.primary,
  },
  questionNumberUnanswered: {
    backgroundColor: Colors.light.cardBackgroundSoft,
    borderColor: Colors.light.borderSubtle,
  },
  questionNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.mutedText,
  },
  questionNumberTextCurrent: {
    color: 'white',
  },
  questionNumberTextAnswered: {
    color: Colors.light.greenPrimary,
  },
  questionNumberIcon: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  questionCard: {
    backgroundColor: Colors.light.cardBackground,
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  questionCardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.surfaceDarkText,
  },
  questionTypeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionTypeSingle: {
    backgroundColor: Colors.light.primarySoft,
  },
  questionTypeMultiple: {
    backgroundColor: Colors.light.accentEmeraldSoft,
  },
  questionTypeTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.light.subtleText,
  },
  questionCardText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
    color: Colors.light.surfaceDarkText,
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 8,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: Colors.light.cardBackgroundSoft,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.light.borderSubtle,
  },
  optionSelected: {
    backgroundColor: Colors.light.primary,
    borderColor: Colors.light.primary,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.light.borderSubtle,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.light.primaryMuted,
  },
  optionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.light.borderSubtle,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionCheckboxSelected: {
    backgroundColor: Colors.light.icon,
    borderColor: Colors.light.icon,
  },
  optionCardText: {
    color: Colors.light.surfaceDarkText,
    fontSize: 14,
    flex: 1,
  },
  questionDivider: {
    height: 1,
    backgroundColor: Colors.light.borderSubtle,
    marginTop: 20,
  },
  questionsToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: Colors.light.cardBackgroundSoft,
    borderRadius: 10,
  },
  questionsToggleText: {
    color: Colors.light.surfaceDarkText,
    fontWeight: '600',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: '#ef4444',
    marginHorizontal: 16,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.cardBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: height * 0.7,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalGrid: {
    marginBottom: 20,
  },
  modalStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  modalStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalStatDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  modalStatCurrent: {
    backgroundColor: Colors.light.primary,
  },
  modalStatAnswered: {
    backgroundColor: Colors.light.greenPrimary,
  },
  modalStatUnanswered: {
    backgroundColor: Colors.light.borderSubtle,
  },
  modalStatText: {
    fontSize: 12,
    color: Colors.light.mutedText,
  },
});
