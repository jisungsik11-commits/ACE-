import { useState } from 'react';
import { Table, ShieldAlert, CheckCircle, Database, UserX, UserCheck, RefreshCw } from 'lucide-react';
import { SheetRow, BlacklistRow, UserState } from '../types';

interface GroomSheetViewProps {
  userState: UserState;
  sheetRows: SheetRow[];
  blacklistRows: BlacklistRow[];
  onSetContractCompleted: () => void;
  onResetSimulation: () => void;
}

export default function GroomSheetView({
  userState,
  sheetRows,
  blacklistRows,
  onSetContractCompleted,
  onResetSimulation
}: GroomSheetViewProps) {
  const [activeTab, setActiveTab] = useState<'groom' | 'blacklist'>('groom');

  return (
    <div className="bg-[#121212] border border-[#2A2A2A] rounded-xl overflow-hidden shadow-2xl" id="google-sheets-simulator">
      {/* Header */}
      <div className="bg-[#1E1E1E] px-4 py-3 border-b border-[#2A2A2A] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-500 animate-pulse" />
          <span className="font-sans font-semibold text-sm text-gray-200 tracking-tight">
            Google Sheets 실시간 자동화 모니터 (동기화 엔진)
          </span>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-mono uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            CONNECTED
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Admin Control Trigger for Step 5 */}
          {userState.contractStatus === 'SIGNED' && (
            <button
              onClick={onSetContractCompleted}
              className="bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-sans text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 transition-all animate-bounce"
              title="관리자 권한으로 계약 완료 승인"
              id="admin-approve-btn"
            >
              <UserCheck className="w-3.5 h-3.5" />
              사장님 승인: [계약완료] 변경
            </button>
          )}

          <button
            onClick={onResetSimulation}
            className="text-gray-400 hover:text-gray-200 p-1.5 rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors"
            title="시뮬레이션 초기화"
            id="reset-simulation-btn"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A2A] bg-[#161616]">
        <button
          onClick={() => setActiveTab('groom')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-sans font-medium border-r border-[#2A2A2A] transition-colors ${
            activeTab === 'groom'
              ? 'bg-[#121212] text-amber-400 border-t-2 border-t-amber-500'
              : 'text-gray-400 hover:bg-neutral-900 hover:text-gray-200'
          }`}
          id="tab-groom-sheet"
        >
          <Table className="w-3.5 h-3.5" />
          신랑 회원 시트 (Groom_List)
          <span className="bg-[#2A2A2A] text-gray-300 text-[9px] px-1.5 py-0.2 rounded-full">
            {sheetRows.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('blacklist')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-sans font-medium border-r border-[#2A2A2A] transition-colors ${
            activeTab === 'blacklist'
              ? 'bg-[#121212] text-red-400 border-t-2 border-t-red-500'
              : 'text-gray-400 hover:bg-neutral-900 hover:text-gray-200'
          }`}
          id="tab-blacklist-sheet"
        >
          <ShieldAlert className="w-3.5 h-3.5" />
          블랙리스트 시트 (Black_List)
          <span className="bg-red-950 text-red-400 border border-red-900 text-[9px] px-1.5 py-0.2 rounded-full">
            {blacklistRows.length}
          </span>
        </button>
      </div>

      {/* Table Body */}
      <div className="p-3 bg-[#121212] min-h-[160px] overflow-x-auto">
        {activeTab === 'groom' ? (
          <table className="w-full text-left font-mono text-[11px] text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-gray-400 text-[10px]">
                <th className="pb-2 font-medium w-12 text-center">No.</th>
                <th className="pb-2 font-medium">신랑 성명</th>
                <th className="pb-2 font-medium">연락처</th>
                <th className="pb-2 font-medium">가입 일시</th>
                <th className="pb-2 font-medium">결제 시간</th>
                <th className="pb-2 font-medium text-center">회원 등급</th>
                <th className="pb-2 font-medium text-center">성혼 계약</th>
                <th className="pb-2 font-medium pl-2">자동화 비고</th>
              </tr>
            </thead>
            <tbody>
              {sheetRows.map((row) => (
                <tr
                  key={row.index}
                  className={`border-b border-[#1E1E1E] last:border-0 hover:bg-[#1A1A1A]/80 transition-colors ${
                    row.phone === userState.phone ? 'bg-amber-950/20 text-amber-100' : ''
                  }`}
                >
                  <td className="py-2 text-center text-gray-500">{row.index}</td>
                  <td className="py-2 font-sans font-medium">{row.name}</td>
                  <td className="py-2">{row.phone}</td>
                  <td className="py-2 text-gray-400">{row.signUpTime}</td>
                  <td className="py-2 text-gray-400">{row.paymentTime || '-'}</td>
                  <td className="py-2 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-sans font-bold ${
                        row.grade === 'VIP'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : row.grade === 'GOLD'
                          ? 'bg-yellow-950/60 text-yellow-500'
                          : row.grade === 'SILVER'
                          ? 'bg-slate-800 text-slate-300'
                          : row.grade === 'BRONZE'
                          ? 'bg-amber-900/40 text-amber-600'
                          : row.grade === 'BLACK'
                          ? 'bg-red-950 text-red-500 border border-red-900 font-extrabold animate-pulse'
                          : 'bg-neutral-800 text-gray-400'
                      }`}
                    >
                      {row.grade}
                    </span>
                  </td>
                  <td className="py-2 text-center">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-sans font-medium ${
                        row.contractStatus === 'COMPLETED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-950'
                          : row.contractStatus === 'SIGNED'
                          ? 'bg-blue-950 text-blue-400 border border-blue-900 animate-pulse'
                          : row.contractStatus === 'SIGNING'
                          ? 'bg-indigo-950 text-indigo-400'
                          : 'text-gray-500'
                      }`}
                    >
                      {row.contractStatus === 'COMPLETED'
                        ? '계약완료'
                        : row.contractStatus === 'SIGNED'
                        ? '서명완료'
                        : row.contractStatus === 'SIGNING'
                        ? '서약진행'
                        : '대기'}
                    </span>
                  </td>
                  <td className="py-2 pl-2 text-gray-400 text-[10px] font-sans italic max-w-xs truncate">
                    {row.note}
                  </td>
                </tr>
              ))}
              {sheetRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500 font-sans">
                    데이터가 비어있습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left font-mono text-[11px] text-gray-300 border-collapse">
            <thead>
              <tr className="border-b border-[#2A2A2A] text-gray-400 text-[10px]">
                <th className="pb-2 font-medium w-12 text-center">No.</th>
                <th className="pb-2 font-medium">제명 대상자</th>
                <th className="pb-2 font-medium">차단 연락처</th>
                <th className="pb-2 font-medium">블랙 제명 일시</th>
                <th className="pb-2 font-medium">차단 상태</th>
                <th className="pb-2 font-medium pl-2">제명 사유 (자동 기록)</th>
              </tr>
            </thead>
            <tbody>
              {blacklistRows.map((row) => (
                <tr
                  key={row.index}
                  className={`border-b border-[#1E1E1E] last:border-0 hover:bg-[#1A1A1A]/80 transition-colors ${
                    row.phone === userState.phone ? 'bg-red-950/30 text-red-200' : ''
                  }`}
                >
                  <td className="py-2 text-center text-gray-500">{row.index}</td>
                  <td className="py-2 font-sans font-medium text-red-400">{row.name}</td>
                  <td className="py-2 text-red-300">{row.phone}</td>
                  <td className="py-2 text-gray-400">{row.bannedTime}</td>
                  <td className="py-2">
                    <span className="bg-red-950 text-red-400 border border-red-900 text-[9px] px-1.5 py-0.5 rounded font-sans font-bold flex items-center gap-1 w-fit">
                      <UserX className="w-3 h-3" />
                      영구 차단
                    </span>
                  </td>
                  <td className="py-2 pl-2 text-red-400/80 font-sans text-[10px] max-w-xs truncate">
                    {row.reason}
                  </td>
                </tr>
              ))}
              {blacklistRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 font-sans">
                    등록된 블랙리스트 정보가 없습니다. (깨끗한 청정 공간)
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Instructions for the User */}
      <div className="bg-[#161616] px-4 py-2.5 border-t border-[#2A2A2A] text-[10px] text-gray-400 font-sans flex items-center justify-between">
        <span>💡 신랑이 마이페이지에서 [환불 신청]을 누르거나 성혼 계약을 신청하면 구글 시트 데이터가 즉시 실시간으로 조작·전이됩니다.</span>
        <span className="text-amber-500 font-medium">구글 자동화 봇 연동 완료</span>
      </div>
    </div>
  );
}
