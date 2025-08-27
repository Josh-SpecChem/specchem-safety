'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  CheckCircle, 
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Menu,
  X,
  Globe,
  Package,
  Shield,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface QuizQuestion {
  id: string;
  type: 'true-false' | 'multiple-choice';
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

export default function EbookSpanishPage() {
  const [currentSection, setCurrentSection] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string | string[]>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<string, boolean>>({});
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

  const handleQuizSubmit = (questionId: string, answer: string | string[]) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answer }));
    setShowQuizResults(prev => ({ ...prev, [questionId]: true }));
  };

  const QuizComponent = ({ quiz }: { quiz: QuizQuestion }) => {
    const userAnswer = quizAnswers[quiz.id];
    const showResult = showQuizResults[quiz.id];
    const isCorrect = Array.isArray(quiz.correctAnswer) 
      ? Array.isArray(userAnswer) && 
        quiz.correctAnswer.length === userAnswer.length &&
        quiz.correctAnswer.every(ans => userAnswer.includes(ans))
      : userAnswer === quiz.correctAnswer;

    return (
      <Card className="my-8 border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertTriangle className="h-5 w-5" />
            Verificación de Conocimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="font-medium text-gray-900">{quiz.question}</p>
            
            {quiz.type === 'true-false' ? (
              <div className="space-y-2">
                {['Verdadero', 'Falso'].map((option) => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={quiz.id}
                      value={option}
                      disabled={showResult}
                      onChange={(e) => setQuizAnswers(prev => ({ ...prev, [quiz.id]: e.target.value }))}
                      className="text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {quiz.options?.map((option, index) => (
                  <label key={index} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type={Array.isArray(quiz.correctAnswer) ? "checkbox" : "radio"}
                      name={quiz.id}
                      value={String.fromCharCode(65 + index)} // A, B, C, D, etc.
                      disabled={showResult}
                      onChange={(e) => {
                        if (Array.isArray(quiz.correctAnswer)) {
                          const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
                          if (e.target.checked) {
                            setQuizAnswers(prev => ({ 
                              ...prev, 
                              [quiz.id]: [...currentAnswers, e.target.value] 
                            }));
                          } else {
                            setQuizAnswers(prev => ({ 
                              ...prev, 
                              [quiz.id]: currentAnswers.filter(ans => ans !== e.target.value) 
                            }));
                          }
                        } else {
                          setQuizAnswers(prev => ({ ...prev, [quiz.id]: e.target.value }));
                        }
                      }}
                      className="text-blue-600"
                    />
                    <span>{String.fromCharCode(65 + index)}. {option}</span>
                  </label>
                ))}
              </div>
            )}

            {!showResult && userAnswer && (
              <Button 
                onClick={() => handleQuizSubmit(quiz.id, userAnswer)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Enviar Respuesta
              </Button>
            )}

            {showResult && (
              <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className={`h-5 w-5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`} />
                  <span className={`font-medium ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '¡Correcto!' : 'Incorrecto'}
                  </span>
                </div>
                <p className="text-gray-700">{quiz.explanation}</p>
                {!isCorrect && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Respuesta correcta:</strong> {Array.isArray(quiz.correctAnswer) 
                      ? quiz.correctAnswer.join(', ') 
                      : quiz.correctAnswer}
                  </p>
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
      id: 'introduccion',
      title: 'Introducción y Resumen',
      icon: BookOpen,
      content: (
        <div className="space-y-8">
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Capacitación Específica por Función - Materiales Peligrosos
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Manejo, Empaque y Envío de Materiales Regulados por DOT
            </p>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Capacitación Profesional SpecChem
            </Badge>
          </div>

          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">Bienvenido a la Capacitación Específica por Función de SpecChem</h2>
              <p className="text-lg leading-relaxed text-gray-700 mb-6">
                Este curso integral de capacitación cubre los requisitos y expectativas para el manejo, empaque y envío de materiales regulados por DOT en su trabajo en SpecChem.
              </p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Por Qué Importa Esta Capacitación</h3>
                <p className="text-gray-700 mb-4">
                  <strong>El Título 49 del Código de Regulaciones Federales</strong> requiere que cualquier asociado que empaque, maneje o transporte materiales peligrosos debe recibir capacitación cada tres años sobre los siguientes temas de materiales peligrosos:
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {[
                  { title: 'Conciencia General', desc: 'Familiarización con varios aspectos involucrados con materiales peligrosos' },
                  { title: 'Capacitación Específica por Función', desc: 'Cómo se manejan los materiales peligrosos en su trabajo específico' },
                  { title: 'Capacitación de Seguridad', desc: 'Manejo seguro de materiales peligrosos' },
                  { title: 'Conciencia de Seguridad', desc: 'Problemas de seguridad de HAZMAT' },
                  { title: 'Seguridad Profunda', desc: 'Capacitación detallada sobre mantener la seguridad al tratar con materiales peligrosos' }
                ].map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{index + 1}. {item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Resultados Clave de Aprendizaje</h3>
                <p className="text-gray-700 mb-4">Hay seis cosas que debe obtener de esta capacitación:</p>
                <ul className="space-y-2 text-gray-700">
                  {[
                    'Un entendimiento básico de qué es el empaque calificado por UN',
                    'Cómo puede encontrar información sobre qué empaque usar para materiales específicos y cómo empaquetarlo',
                    'Un entendimiento básico de cómo marcar material peligroso para envío',
                    'Cómo localizar las etiquetas apropiadas para marcar empaque HAZ',
                    'Dónde encontrar información sobre el cierre apropiado requerido del empaque HAZ',
                    'Conciencia de la herramienta apropiada para usar al cerrar cubetas, tambores o contenedores, especialmente aquellos que contienen materiales regulados por DOT'
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
      )
    },

    {
      id: 'fundamentos-empaque-un',
      title: 'Fundamentos del Empaque Calificado UN',
      icon: Package,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-blue-600" />
                Entendiendo el Empaque Calificado UN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-lg leading-relaxed text-gray-700">
                  No se espera que recuerde toda la información detallada, pero debe estar consciente de lo que distingue los materiales de empaque utilizados para materiales regulados por DOT del empaque estándar.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">¿Qué Hace Especial al Empaque Calificado UN?</h3>
                <p className="text-gray-700 leading-relaxed">
                  Las calificaciones UN para empaque se desarrollaron para que el transporte de materiales peligrosos fuera más seguro y más fácil. Si un material está regulado por DOT, debe mantenerse en empaque calificado UN, ya sea para almacenamiento o para transporte.
                </p>

                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <Shield className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Calificación Multifacética</h4>
                    <p className="text-sm text-gray-600">Letras y números marcados permanentemente en contenedores</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <CheckCircle className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Pruebas Rigurosas</h4>
                    <p className="text-sm text-gray-600">Serie de pruebas para demostrar conformidad con estándares</p>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
                    <FileText className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-900 mb-2">Aplicación DOT</h4>
                    <p className="text-sm text-gray-600">El Departamento de Transporte de EE.UU. aplica las regulaciones</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">Estándares de Prueba Integrales</h3>
                <p className="text-gray-700 mb-4">
                  Las pruebas de contenedores de empaque incluyen múltiples evaluaciones rigurosas:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { test: 'Prueba de Presión Externa', purpose: 'Asegurar que los contenedores puedan resistir cambios en la presión externa sin fallar' },
                    { test: 'Prueba de Presión Interna', purpose: 'Asegurar que los contenedores no fallen bajo condiciones de presión interna' },
                    { test: 'Prueba de Soporte de Peso', purpose: 'Los contenedores pueden soportar peso por períodos extendidos a alta temperatura sin fallar' },
                    { test: 'Prueba de Vibración', purpose: 'Los contenedores pueden resistir vibraciones que ocurren durante el transporte' },
                    { test: 'Prueba de Caída', purpose: 'Los contenedores pueden resistir caídas libres que pueden ocurrir durante el transporte' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-1">{item.test}</h4>
                      <p className="text-sm text-gray-600">{item.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },

    {
      id: 'cuando-se-requiere-un',
      title: 'Cuándo se Requiere Empaque Calificado UN',
      icon: AlertTriangle,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
                Requisitos del Empaque Calificado UN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">¿Cuándo se Requiere Empaque Calificado UN?</h3>
                <p className="text-gray-700 mb-4">
                  Se requiere empaque calificado UN si el material que se empaca para transporte está clasificado como cualquiera de los siguientes:
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: 'Explosivo', emoji: '💥', class: 'Clase 1' },
                  { type: 'Gas no inflamable', emoji: '🌬️', class: 'Clase 2.2' },
                  { type: 'Gas inflamable', emoji: '🔥', class: 'Clase 2.1' },
                  { type: 'Líquido inflamable', emoji: '🔥', class: 'Clase 3' },
                  { type: 'Sustancia infecciosa', emoji: '🦠', class: 'Clase 6.2' },
                  { type: 'Material corrosivo', emoji: '⚠️', class: 'Clase 8' },
                  { type: 'Sólido inflamable', emoji: '🔥', class: 'Clase 4.1' },
                  { type: 'Oxidante', emoji: '💨', class: 'Clase 5.1' },
                  { type: 'Peróxido orgánico', emoji: '🧪', class: 'Clase 5.2' },
                  { type: 'Materiales tóxicos', emoji: '☠️', class: 'Clase 6.1' },
                  { type: 'Radioactivo', emoji: '☢️', class: 'Clase 7' }
                ].map((item, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                    <div className="text-2xl mb-2">{item.emoji}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{item.type}</h4>
                    <p className="text-xs text-gray-500">{item.class}</p>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Materiales Comunes de SpecChem</h3>
                <p className="text-gray-700 mb-4">
                  En SpecChem, los materiales que manejará que requieren empaque calificado UN serán principalmente:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">🔥 Líquidos inflamables</h4>
                    <p className="text-sm text-gray-600">(Más común)</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">⚠️ Corrosivos</h4>
                    <p className="text-sm text-gray-600">Sustancias químicas que causan daño</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">☠️ Materiales tóxicos</h4>
                    <p className="text-sm text-gray-600">Sustancias químicas dañinas</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">💨 Oxidantes</h4>
                    <p className="text-sm text-gray-600">(Uso ocasional)</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-100 border-2 border-red-300 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <h3 className="text-xl font-bold text-gray-900">Regla Crítica - Sin Excepciones</h3>
                </div>
                <p className="text-lg font-semibold text-gray-900 mb-3">
                  La conclusión más importante de esta capacitación es:
                </p>
                <div className="bg-white border border-red-300 rounded p-4">
                  <p className="text-gray-700 font-medium">
                    Porque el empaque calificado UN está diseñado, probado y regulado para asegurar el envío y almacenamiento más seguro de materiales peligrosos, <strong>nunca es aceptable</strong> sustituir empaque no calificado UN cuando se trabaja con materiales clasificados como peligrosos. <strong>No hay excepciones.</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: 'pregunta-1',
        type: 'true-false',
        question: 'Si está empacando material regulado por DOT y encuentra que no tiene suficientes contenedores calificados UN para completar la producción, puede sustituir contenedores no calificados UN siempre que el número de cubetas no calificadas UN sea menos del 10% del total empacado.',
        correctAnswer: 'Falso',
        explanation: 'Nunca es permitido bajo ninguna circunstancia empacar material peligroso en empaque no calificado UN. No hay absolutamente ninguna excepción a esta regla.'
      }
    },

    {
      id: 'responsabilidad-cumplimiento',
      title: 'Responsabilidad y Cumplimiento',
      icon: Shield,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-600" />
                Entendiendo Responsabilidad y Cumplimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Como resultado, siempre debe prestar atención al tipo de empaque que está usando para cualquier material, para que los materiales regulados por DOT sean empacados en el contenedor apropiado, y que el contenedor esté cerrado apropiadamente.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsabilidad del DOT</h3>
                  <p className="text-gray-700 mb-4">
                    Aprendimos anteriormente que el DOT tiene la responsabilidad de asegurar el cumplimiento con las regulaciones relacionadas con el manejo y transporte de materiales peligrosos.
                  </p>
                  <div className="bg-white rounded p-3">
                    <p className="text-sm text-gray-600 font-medium">
                      El Departamento de Transporte de EE.UU. aplica todas las regulaciones de materiales peligrosos
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsabilidad del Expedidor</h3>
                  <p className="text-gray-700 mb-4">
                    Sin embargo, es responsabilidad del <strong>expedidor</strong> asegurarse de que las operaciones que involucran materiales regulados por DOT estén en cumplimiento.
                  </p>
                  <div className="space-y-2">
                    {[
                      'El empaque usado debe estar autorizado',
                      'Apropiadamente fabricado',
                      'Apropiadamente ensamblado', 
                      'Apropiadamente marcado'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-2 bg-white rounded p-2">
                        <CheckCircle className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuestra Responsabilidad</h3>
                <p className="text-gray-700 mb-4">
                  Es nuestra responsabilidad, <strong>tanto corporativa como individualmente</strong>, asegurarnos de que estamos comprando y usando el empaque apropiado, y que el material esté apropiadamente identificado para envío.
                </p>
                
                <div className="bg-white border border-red-300 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-gray-900">Consecuencia del Incumplimiento</span>
                  </div>
                  <p className="text-gray-700">
                    <strong>El no cumplir con esta responsabilidad puede ser costoso.</strong>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: 'pregunta-2',
        type: 'multiple-choice',
        question: '¿Cuál de las siguientes declaraciones no es verdadera sobre el empaque calificado UN?',
        options: [
          'Las calificaciones UN son requeridas para el empaque usado en envío y almacenamiento de materiales peligrosos.',
          'La aplicación de las regulaciones UN actuales es responsabilidad del Buró Federal de Investigación, o FBI.',
          'Una calificación UN es un conjunto de letras y números que especifican lo que el contenedor particular está regulado para contener.',
          'El empaque debe estar marcado permanentemente en el fondo y ya sea en el lado o la parte superior.'
        ],
        correctAnswer: 'B',
        explanation: 'La aplicación de las regulaciones UN actuales es realmente responsabilidad del Departamento de Transporte (DOT), no del FBI.'
      }
    },

    {
      id: 'fuentes-informacion',
      title: 'Fuentes de Información sobre Empaque',
      icon: BookOpen,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-green-600" />
                Dónde Encontrar Información sobre Empaque
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                Al trabajar con materiales regulados por DOT, debe saber dónde encontrar información sobre qué tipo de empaque usar y cómo empaquetarlo apropiadamente.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Hoja de Datos de Seguridad (SDS)</h3>
                  <p className="text-gray-700 mb-4">
                    La <strong>fuente primaria</strong> de información sobre empaque para cualquier material regulado por DOT.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Información de clasificación DOT</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Requisitos de empaque específicos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Instrucciones de manipulación</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Regulaciones CFR Título 49</h3>
                  <p className="text-gray-700 mb-4">
                    Las regulaciones federales completas para el transporte de materiales peligrosos.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Tabla de materiales peligrosos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Especificaciones de empaque</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Requisitos de marcado</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Clave en la SDS</h3>
                <p className="text-gray-700 mb-4">
                  En la Sección 14 de la SDS, encontrará la información de transporte más importante:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { term: 'Nombre Apropiado de Envío UN', desc: 'El nombre oficial para el transporte' },
                    { term: 'Número de Identificación', desc: 'Número UN de 4 dígitos' },
                    { term: 'Clase de Peligro', desc: 'Categoría de material peligroso' },
                    { term: 'Grupo de Empaque', desc: 'Nivel de peligro (I, II, o III)' },
                    { term: 'Peligros Ambientales', desc: 'Si es peligroso para el medio ambiente' },
                    { term: 'Precauciones Especiales', desc: 'Requisitos adicionales de transporte' }
                  ].map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded p-3">
                      <h4 className="font-medium text-gray-900 mb-1">{item.term}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },

    {
      id: 'marcado-empaque',
      title: 'Marcado y Etiquetado de Empaque',
      icon: Package,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-6 w-6 text-orange-600" />
                Marcado Apropiado de Material Peligroso
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Requisitos de Marcado</h3>
                <p className="text-gray-700 mb-4">
                  Todo empaque que contenga material regulado por DOT debe estar marcado con información específica antes del envío.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Marcado Requerido</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Nombre Apropiado de Envío UN', example: 'UN1263, Pintura' },
                      { label: 'Número de Identificación UN', example: 'UN1263' },
                      { label: 'Nombre y Dirección del Expedidor', example: 'SpecChem, 123 Main St.' },
                      { label: 'Nombre y Dirección del Destinatario', example: 'Cliente ABC, 456 Oak Ave.' }
                    ].map((item, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-1">{item.label}</h4>
                        <p className="text-sm text-gray-600 italic">{item.example}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Etiquetas de Peligro</h3>
                  <p className="text-gray-700 mb-4">
                    Las etiquetas visuales comunican los peligros específicos del material.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { type: 'Inflamable', color: 'bg-red-100 border-red-300', emoji: '🔥' },
                      { type: 'Corrosivo', color: 'bg-yellow-100 border-yellow-300', emoji: '⚠️' },
                      { type: 'Tóxico', color: 'bg-purple-100 border-purple-300', emoji: '☠️' },
                      { type: 'Oxidante', color: 'bg-orange-100 border-orange-300', emoji: '💨' }
                    ].map((label, index) => (
                      <div key={index} className={`${label.color} border rounded-lg p-3 text-center`}>
                        <div className="text-2xl mb-1">{label.emoji}</div>
                        <p className="text-sm font-medium">{label.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Marcado Crítico</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  <strong>El marcado inadecuado puede resultar en:</strong>
                </p>
                <ul className="space-y-2 text-gray-700">
                  {[
                    'Rechazos del transportista',
                    'Multas regulatorias',
                    'Retrasos en el envío',
                    'Problemas de seguridad',
                    'Responsabilidad legal'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: 'pregunta-3',
        type: 'multiple-choice',
        question: '¿Cuál es la fuente primaria de información sobre requisitos de empaque para materiales regulados por DOT?',
        options: [
          'El manual de empleados de SpecChem',
          'La Hoja de Datos de Seguridad (SDS) del material',
          'Las instrucciones del supervisor',
          'El sitio web del proveedor de empaque'
        ],
        correctAnswer: 'B',
        explanation: 'La Hoja de Datos de Seguridad (SDS) es la fuente primaria de información sobre clasificación DOT y requisitos de empaque para cualquier material regulado.'
      }
    },

    {
      id: 'procedimientos-cierre',
      title: 'Procedimientos de Cierre del Empaque',
      icon: Shield,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-purple-600" />
                Cierre Apropiado del Empaque UN
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-gray-700 leading-relaxed">
                El cierre apropiado del empaque calificado UN es crítico para mantener la integridad del contenedor y cumplir con las regulaciones de seguridad.
              </p>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Por Qué es Importante el Cierre Apropiado?</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Integridad del Contenedor</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Previene fugas durante el transporte</li>
                      <li>• Mantiene las propiedades de barrera</li>
                      <li>• Preserva la calificación UN</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Cumplimiento Regulatorio</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Requerido por las regulaciones DOT</li>
                      <li>• Validado durante inspecciones</li>
                      <li>• Crítico para la responsabilidad legal</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Herramientas de Cierre Apropiadas</h3>
                  <div className="space-y-4">
                    {[
                      { 
                        tool: 'Llave de Torsión', 
                        use: 'Para tambores con cierre de rosca',
                        spec: 'Torque específico requerido'
                      },
                      { 
                        tool: 'Sellador de Cubetas', 
                        use: 'Para cubetas con tapa a presión',
                        spec: 'Presión uniforme alrededor del borde'
                      },
                      { 
                        tool: 'Banda de Cierre', 
                        use: 'Para contenedores con banda metálica',
                        spec: 'Tensión apropiada según especificaciones'
                      }
                    ].map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded p-3">
                        <h4 className="font-medium text-gray-900">{item.tool}</h4>
                        <p className="text-sm text-gray-600 mb-1">{item.use}</p>
                        <p className="text-xs text-gray-500 italic">{item.spec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Pasos del Proceso de Cierre</h3>
                  <div className="space-y-3">
                    {[
                      'Verificar que el empaque esté limpio y sin daños',
                      'Instalar el material de sellado apropiado si es requerido',
                      'Colocar la tapa o cierre en la posición correcta',
                      'Aplicar la fuerza de cierre usando la herramienta apropiada',
                      'Verificar que el cierre cumpla con las especificaciones',
                      'Documentar el proceso de cierre si es requerido'
                    ].map((step, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="bg-purple-100 text-purple-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-gray-700 text-sm">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Nunca Improvise</h3>
                </div>
                <p className="text-gray-700 font-medium">
                  <strong>Use solo las herramientas y métodos especificados para el cierre del empaque UN.</strong> El uso de herramientas improvisadas o métodos no aprobados puede comprometer la integridad del empaque y violar las regulaciones federales.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },

    {
      id: 'mejores-practicas',
      title: 'Mejores Prácticas y Procedimientos',
      icon: CheckCircle,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Mejores Prácticas para el Manejo de Materiales Peligrosos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enfoque de Seguridad Primero</h3>
                <p className="text-gray-700">
                  En SpecChem, la seguridad siempre viene primero. Estos procedimientos aseguran que manejamos materiales peligrosos de manera segura y en cumplimiento con todas las regulaciones.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Antes del Empaque</h3>
                  <div className="space-y-3">
                    {[
                      'Revisar la SDS para requisitos específicos',
                      'Verificar que el empaque esté calificado UN',
                      'Inspeccionar el empaque por daños',
                      'Confirmar la compatibilidad química',
                      'Usar el PPE apropiado'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Durante el Empaque</h3>
                  <div className="space-y-3">
                    {[
                      'Seguir los procedimientos establecidos',
                      'No exceder las capacidades de llenado',
                      'Evitar la contaminación cruzada',
                      'Manejar los materiales con cuidado',
                      'Mantener el área de trabajo limpia'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Después del Empaque</h3>
                  <div className="space-y-3">
                    {[
                      'Cerrar el empaque apropiadamente',
                      'Aplicar todo el marcado requerido',
                      'Colocar las etiquetas de peligro',
                      'Completar la documentación',
                      'Almacenar seguramente hasta el envío'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">En Caso de Emergencia</h3>
                  <div className="space-y-3">
                    {[
                      'Detener el trabajo inmediatamente',
                      'Asegurar el área si es seguro hacerlo',
                      'Notificar al supervisor inmediatamente',
                      'Seguir los procedimientos de emergencia',
                      'Documentar el incidente apropiadamente'
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recursos de Apoyo</h3>
                <p className="text-gray-700 mb-4">
                  Si tiene preguntas o necesita ayuda con el manejo de materiales peligrosos:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white rounded p-3 text-center">
                    <h4 className="font-medium text-gray-900 mb-1">Su Supervisor</h4>
                    <p className="text-sm text-gray-600">Primera línea de apoyo</p>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <h4 className="font-medium text-gray-900 mb-1">Departamento de Seguridad</h4>
                    <p className="text-sm text-gray-600">Orientación especializada</p>
                  </div>
                  <div className="bg-white rounded p-3 text-center">
                    <h4 className="font-medium text-gray-900 mb-1">Línea Directa de Emergencia</h4>
                    <p className="text-sm text-gray-600">Respuesta de emergencia 24/7</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: 'pregunta-4',
        type: 'true-false',
        question: 'Es aceptable usar una llave estándar en lugar de una llave de torsión para cerrar tambores con material regulado por DOT, siempre que esté bien apretado.',
        correctAnswer: 'Falso',
        explanation: 'Debe usar solo las herramientas especificadas para el cierre del empaque UN. El uso de herramientas improvisadas puede comprometer la integridad del empaque y violar las regulaciones federales.'
      }
    },

    {
      id: 'conclusion-certificacion',
      title: 'Conclusión y Certificación',
      icon: CheckCircle,
      content: (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Conclusión de la Capacitación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8 bg-green-50 rounded-xl">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Felicitaciones!</h2>
                <p className="text-xl text-gray-600 mb-6">
                  Ha completado con éxito la Capacitación Específica por Función para Materiales Peligrosos
                </p>
                <Badge variant="outline" className="text-lg px-6 py-3 bg-green-100 border-green-300">
                  Capacitación Certificada SpecChem
                </Badge>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Puntos Clave para Recordar</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'El empaque calificado UN es OBLIGATORIO para todos los materiales regulados por DOT - sin excepciones',
                    'La Hoja de Datos de Seguridad (SDS) es su fuente primaria de información sobre requisitos de empaque',
                    'Use solo herramientas especializadas y calibradas para cerrar empaque UN',
                    'El marcado y etiquetado apropiados son críticos para el cumplimiento y la seguridad',
                    'Mantenga registros detallados de todas las actividades de materiales peligrosos',
                    'En emergencias: DETENER, ASEGURAR, REPORTAR, DOCUMENTAR'
                  ].map((point, index) => (
                    <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-3">Sus Responsabilidades</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Seguir todos los procedimientos aprendidos</li>
                    <li>• Usar solo empaque calificado UN</li>
                    <li>• Mantener documentación apropiada</li>
                    <li>• Reportar cualquier problema inmediatamente</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-3">Recursos Disponibles</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Su supervisor para preguntas</li>
                    <li>• Departamento de Seguridad</li>
                    <li>• Hojas de Datos de Seguridad (SDS)</li>
                    <li>• Línea directa de emergencia 24/7</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="font-semibold text-gray-900 mb-3">Próximos Pasos</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Aplicar inmediatamente lo aprendido</li>
                    <li>• Practicar bajo supervisión inicial</li>
                    <li>• Recertificación en 3 años</li>
                    <li>• Capacitación continua según necesidad</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Compromiso con la Seguridad</h3>
                <p className="text-gray-700 leading-relaxed">
                  Al completar esta capacitación, usted se compromete a manejar materiales peligrosos de manera segura y responsable. 
                  Recuerde que la seguridad es responsabilidad de todos, y su adherencia a estos procedimientos protege no solo a usted mismo, 
                  sino también a sus compañeros de trabajo, al público y al medio ambiente.
                </p>
                
                <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
                  <p className="text-blue-800 font-medium text-center">
                    "En SpecChem, la seguridad no es negociable. Cada procedimiento tiene un propósito, 
                    y cada empleado capacitado hace la diferencia."
                  </p>
                </div>
              </div>

              <div className="text-center py-6">
                <p className="text-gray-600 mb-4">
                  Esta capacitación cumple con los requisitos del Título 49 CFR para Capacitación Específica por Función
                </p>
                <p className="text-sm text-gray-500">
                  Fecha de Finalización: {new Date().toLocaleDateString('es-ES')} | 
                  Válida hasta: {new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      ),
      quiz: {
        id: 'pregunta-5',
        type: 'multiple-choice',
        question: '¿Con qué frecuencia se requiere recertificación para la capacitación de materiales peligrosos según las regulaciones federales?',
        options: [
          'Cada año',
          'Cada 2 años',
          'Cada 3 años',
          'Cada 5 años'
        ],
        correctAnswer: 'C',
        explanation: 'Las regulaciones federales del Título 49 CFR requieren que la capacitación de materiales peligrosos se renueve cada 3 años para mantener el cumplimiento.'
      }
    }
  ];

  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with Progress */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Capacitación Específica por Función - Materiales Peligrosos</h1>
                  <p className="text-sm text-gray-500">Módulo de Aprendizaje Interactivo</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-600" />
                <select 
                  className="text-sm border border-gray-300 rounded px-2 py-1 bg-white"
                  onChange={(e) => {
                    if (e.target.value === 'en') {
                      router.push('/ebook');
                    }
                  }}
                  defaultValue="es"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                </select>
              </div>
              <div className="hidden sm:block text-sm text-gray-600">
                Sección {currentSection + 1} de {sections.length}
              </div>
              <div className="w-32">
                <Progress value={progress} className="h-2" />
              </div>
              <div className="text-sm font-medium text-gray-700">
                {Math.round(progress)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-16 left-0 z-30 w-80 h-screen bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto`}>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Tabla de Contenidos</h2>
            <nav className="space-y-2">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => handleSectionChange(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    currentSection === index
                      ? 'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <section.icon className={`h-5 w-5 ${currentSection === index ? 'text-blue-600' : 'text-gray-400'}`} />
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-sm text-gray-500">Sección {index + 1}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Progreso de Estudio</h3>
              <Progress value={progress} className="mb-2" />
              <p className="text-sm text-blue-600">{Math.round(progress)}% Completado</p>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div 
            ref={contentRef}
            className="h-screen overflow-y-auto p-6 lg:p-12"
          >
            <div className="max-w-4xl mx-auto">
              {sections[currentSection]?.content}
              
              {sections[currentSection]?.quiz && (
                <QuizComponent quiz={sections[currentSection].quiz!} />
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => handleSectionChange(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Anterior
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Sección {currentSection + 1} de {sections.length}
                  </p>
                </div>

                <Button
                  onClick={() => handleSectionChange(Math.min(sections.length - 1, currentSection + 1))}
                  disabled={currentSection === sections.length - 1}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                >
                  Siguiente
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
