'use client';

import { useState } from 'react';
import { LineNumberTextarea } from './LineNumberTextarea';
import { FileUploadArea } from './FileUploadArea';

export function ReviewSection() {
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    console.log('Submitting for review:', { description });
  };

  return (
    <section className="p-6 lg:p-10 flex flex-col h-full bg-[#0a0a0a] text-white overflow-hidden">
      {/* Section Header */}
      <div className="flex-shrink-0 mb-6">
        <div className="inline-flex items-center gap-2 mb-3 px-3 h-8 bg-emerald-500/10 rounded-full border border-emerald-500/20">
          <span className="text-base leading-none">🔍</span>
          <span className="text-xs font-medium text-emerald-400">피드백이 필요하신가요?</span>
        </div>
        <h1 className="text-xl lg:text-2xl font-semibold leading-tight text-white">
          "잘 만들고 있는 건지 모르겠어요"
        </h1>
        <p className="mt-2 text-gray-400 text-sm">
          전문가 피드백으로 확인해보세요
        </p>
      </div>

      {/* Form */}
      <form className="flex flex-col gap-5 flex-1 min-h-0 overflow-y-auto pr-2">
        {/* Description Textarea */}
        <LineNumberTextarea
          label="내 앱 소개하기"
          placeholder="어떤 앱인지 간단히 설명해주세요..."
          value={description}
          onChange={setDescription}
        />

        {/* File Upload */}
        <FileUploadArea
          label="파일 첨부하기"
          acceptedFormats={['.png', '.jpg', '.zip']}
        />

        {/* Submit Button */}
        <div className="flex-shrink-0 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-emerald-500/20"
          >
            <span>피드백 요청하기</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}

export default ReviewSection;
