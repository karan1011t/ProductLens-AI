import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadArea } from './components/UploadArea';
import { AnalysisView } from './components/AnalysisView';
import { analyzeImage } from './services/geminiService';
import { AnalysisState, ImageFile, ViewState } from './types';
import { AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [viewState, setViewState] = useState<ViewState>(ViewState.UPLOAD);
  const [currentImage, setCurrentImage] = useState<ImageFile | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null
  });

  const handleImageSelected = async (image: ImageFile) => {
    setCurrentImage(image);
    setViewState(ViewState.ANALYZING);
    setAnalysis({ isLoading: true, error: null, result: null });

    try {
      const result = await analyzeImage(image.base64, image.mimeType);
      setAnalysis({
        isLoading: false,
        error: null,
        result: result
      });
      setViewState(ViewState.RESULT);
    } catch (error) {
      setAnalysis({
        isLoading: false,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        result: null
      });
      setViewState(ViewState.UPLOAD); // Go back to upload but show error
    }
  };

  const handleReset = () => {
    setCurrentImage(null);
    setAnalysis({ isLoading: false, error: null, result: null });
    setViewState(ViewState.UPLOAD);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-indigo-500/30">
      <Header />
      
      <main className="relative">
        {/* Ambient Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        {viewState === ViewState.UPLOAD && (
          <div className="max-w-4xl mx-auto px-4 pt-20 pb-12 text-center animate-fade-in">
            <div className="mb-10 space-y-4">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
                Decode Any Product <br />
                <span className="text-indigo-400">Instantly.</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                Upload a photo to get detailed specs, pricing, pros & cons, and buying advice powered by multimodal AI.
              </p>
            </div>
            
            <UploadArea onImageSelected={handleImageSelected} />

            {analysis.error && (
              <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg max-w-2xl mx-auto flex items-start text-left">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-red-400 font-medium text-sm">Analysis Failed</h4>
                  <p className="text-red-300/80 text-sm mt-1">{analysis.error}</p>
                </div>
              </div>
            )}
            
            {/* Examples Grid (Visual Filler) */}
            <div className="mt-20 grid grid-cols-3 gap-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="h-32 bg-slate-800 rounded-lg border border-slate-700"></div>
               <div className="h-32 bg-slate-800 rounded-lg border border-slate-700 translate-y-8"></div>
               <div className="h-32 bg-slate-800 rounded-lg border border-slate-700"></div>
            </div>
          </div>
        )}

        {viewState === ViewState.ANALYZING && currentImage && (
          <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
            <div className="relative w-32 h-32 mb-8">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full overflow-hidden">
                <img src={currentImage.preview} alt="Analyzing" className="w-full h-full object-cover opacity-50" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Analyzing Product...</h3>
            <p className="text-slate-400 animate-pulse">Identifying specs, brand, and market data</p>
          </div>
        )}

        {viewState === ViewState.RESULT && currentImage && analysis.result && (
          <AnalysisView 
            image={currentImage} 
            result={analysis.result} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;