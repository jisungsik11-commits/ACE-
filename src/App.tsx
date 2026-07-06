import { useState, useEffect, FormEvent } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  Lock, 
  Unlock, 
  Sparkles, 
  Download, 
  Play, 
  ArrowRight, 
  FileText, 
  Award, 
  Users, 
  AlertCircle,
  HelpCircle,
  Check,
  Smartphone,
  CheckCircle2,
  LockKeyhole,
  LogOut,
  ChevronRight,
  Eye,
  RefreshCw,
  Edit,
  Plus,
  Trash2,
  Save,
  Image,
  Sliders,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserState, BrideProfile, SheetRow, BlacklistRow, MembershipGrade } from './types';
import { BRIDAL_CATALOG, MEMBERSHIP_TIERS, SECURITY_PLEDGE_TEXT, SIGN_OK_CONTRACT_TEMPLATE } from './data';
import GroomSheetView from './components/GroomSheetView';
import SecurityWatermark from './components/SecurityWatermark';

// ----------------- BRONZE LOCK ICON COMPONENT -----------------
function BronzeLockIcon({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };
  const iconSize = size === 'small' ? 14 : size === 'medium' ? 20 : 28;

  return (
    <div className="relative flex items-center justify-center select-none" id="bronze-lock-icon-container">
      {/* Metallic Bronze glowing background */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#804A00] via-[#CD7F32] to-[#B87333] blur-sm opacity-50 animate-pulse" />
      
      {/* Bronze outer ring bevel */}
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-b from-[#E6933C] via-[#CD7F32] to-[#783F04] p-[2.5px] shadow-[0_4px_12px_rgba(205,127,50,0.4)] relative z-10 flex items-center justify-center`}>
        {/* Dark inner face */}
        <div className="w-full h-full rounded-full bg-[#111111] flex items-center justify-center relative">
          <LockKeyhole size={iconSize} className="text-[#CD7F32]" />
          
          {/* Subtle sparkle shine */}
          <Sparkles className="absolute -top-1 -right-1 w-3.5 h-3.5 text-amber-300 opacity-85 animate-bounce" />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // --- 1. React States ---
  const [userState, setUserState] = useState<UserState>({
    isVerified: false,
    hasSignedPledge: false,
    name: '',
    phone: '',
    grade: 'UNPAID',
    timerSeconds: 3600, // 1 hour
    timerActive: false,
    isTimerExpired: false,
    meetingRequestedBrideId: null,
    contractStatus: 'NONE',
    isPermanentlyBlocked: false,
  });

  // Verification Input Temp State
  const [authForm, setAuthForm] = useState({ name: '', phone: '' });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [showRefundWarningModal, setShowRefundWarningModal] = useState(false);
  const [showSignOkModal, setShowSignOkModal] = useState(false);
  const [showAccountPaymentModal, setShowAccountPaymentModal] = useState(false);
  const [pendingPaymentGrade, setPendingPaymentGrade] = useState<'BRONZE' | 'SILVER' | 'GOLD' | 'VIP' | null>(null);
  const [copiedText, setCopiedText] = useState(false);
  const [selectedBride, setSelectedBride] = useState<BrideProfile | null>(null);
  
  // Custom video playback & document viewer inside Step 5 Unlocked Area
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [showDocModal, setShowDocModal] = useState<boolean>(false);
  const [activeHiddenPhotoIndex, setActiveHiddenPhotoIndex] = useState<number | null>(null);

  // Simulated Google Sheets DB Rows
  const [sheetRows, setSheetRows] = useState<SheetRow[]>([
    {
      index: 1,
      name: '홍길동',
      phone: '010-1234-5678',
      signUpTime: '2026-07-05 09:12',
      paymentTime: '2026-07-05 10:15',
      grade: 'VIP',
      contractStatus: 'NONE',
      note: '전속 VIP 매칭 완료 및 현지 가이드 상담 진행 중'
    },
    {
      index: 2,
      name: '이도령',
      phone: '010-9876-5432',
      signUpTime: '2026-07-05 11:45',
      paymentTime: '',
      grade: 'UNPAID',
      contractStatus: 'NONE',
      note: '본인인증 완료, 멤버십 갤러리 서약 대기 중'
    }
  ]);

  const [blacklistRows, setBlacklistRows] = useState<BlacklistRow[]>([
    {
      index: 1,
      name: '김먹튀',
      phone: '010-9999-8888',
      bannedTime: '2026-07-04 14:22',
      reason: '1시간 이내 악의적 연속 결제 취소로 인한 기기 및 번호 즉시 영구제명'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'gallery' | 'membership' | 'pledge_info' | 'admin'>('gallery');
  const [bridalCatalog, setBridalCatalog] = useState<BrideProfile[]>(BRIDAL_CATALOG);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'ALL' | 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP'>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Admin Selected Bride State
  const [adminSelectedBrideId, setAdminSelectedBrideId] = useState<string>('b1');
  const [adminSearchQuery, setAdminSearchQuery] = useState<string>('');
  const [adminGradeFilter, setAdminGradeFilter] = useState<'ALL' | 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP'>('ALL');
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [newBrideForm, setNewBrideForm] = useState<{
    name: string;
    age: number;
    height: number;
    weight: number;
    location: string;
    grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP';
    avatarUrl: string;
    hiddenPhotos: string[];
    shortBio: string;
  }>({
    name: '',
    age: 23,
    height: 162,
    weight: 47,
    location: '하노이 (Hanoi)',
    grade: 'BRONZE',
    avatarUrl: 'https://images.unsplash.com/photo-1591555200344-05193517d91e?auto=format&fit=crop&q=80&w=400&h=500',
    hiddenPhotos: [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400'
    ],
    shortBio: '한국어 공부를 열심히 하며 따뜻한 가정을 이루고 싶습니다.',
  });
  const [adminEditForm, setAdminEditForm] = useState<{
    name: string;
    age: number;
    height: number;
    weight: number;
    location: string;
    grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP';
    avatarUrl: string;
    hiddenPhotos: string[];
    shortBio: string;
  }>({
    name: '',
    age: 22,
    height: 160,
    weight: 48,
    location: '',
    grade: 'BRONZE',
    avatarUrl: '',
    hiddenPhotos: [],
    shortBio: '',
  });

  // Keep admin edit form in sync with selection
  useEffect(() => {
    const bride = bridalCatalog.find(b => b.id === adminSelectedBrideId);
    if (bride) {
      setAdminEditForm({
        name: bride.name,
        age: bride.age,
        height: bride.height,
        weight: bride.weight,
        location: bride.location,
        grade: bride.grade,
        avatarUrl: bride.avatarUrl,
        hiddenPhotos: [...bride.hiddenPhotos],
        shortBio: bride.shortBio,
      });
    }
  }, [adminSelectedBrideId, bridalCatalog]);

  // --- 2. Live Timer Effect (Step 3 Automation) ---
  useEffect(() => {
    let interval: any;
    if (userState.timerActive && userState.timerSeconds > 0) {
      interval = setInterval(() => {
        setUserState(prev => {
          if (prev.timerSeconds <= 1) {
            clearInterval(interval);
            // Auto expire: Case B Triggered
            return {
              ...prev,
              timerSeconds: 0,
              timerActive: false,
              isTimerExpired: true
            };
          }
          return {
            ...prev,
            timerSeconds: prev.timerSeconds - 1
          };
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [userState.timerActive, userState.timerSeconds]);

  // Sync Timer Expiration back to Sheet Note for completeness
  useEffect(() => {
    if (userState.isTimerExpired && userState.isVerified) {
      // Update our simulated google sheets row to show Refund Disabled
      setSheetRows(prev =>
        prev.map(row =>
          row.phone === userState.phone
            ? { ...row, note: '1시간 타임아웃 경과로 인한 환불 차단 및 서비스 고정완료' }
            : row
        )
      );
    }
  }, [userState.isTimerExpired]);

  // --- 3. Time Formatter ---
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}분 ${s < 10 ? '0' : ''}${s}초`;
  };

  // --- 4. Simulated Authentication Flow (Step 1) ---
  const handleStartAuth = () => {
    if (userState.isPermanentlyBlocked) return;
    setShowAuthModal(true);
  };

  const handleVerifySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!authForm.name.trim() || !authForm.phone.trim()) {
      alert('성함과 연락처를 올바르게 입력해주세요.');
      return;
    }

    // Check if phone is in blacklist
    const isBlacklisted = blacklistRows.some(row => row.phone === authForm.phone);
    if (isBlacklisted) {
      setUserState(prev => ({ ...prev, isPermanentlyBlocked: true, grade: 'BLACK' }));
      setShowAuthModal(false);
      alert('🔒 해당 번호는 불법 유출 방지 및 환불 영구제명 정책으로 인해 접속이 차단되었습니다.');
      return;
    }

    // Step 1: Verification complete, now show security pledge modal
    setShowAuthModal(false);
    setShowPledgeModal(true);
  };

  const handlePledgeAgree = () => {
    const signUpTimeStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    // Save state
    setUserState(prev => ({
      ...prev,
      isVerified: true,
      hasSignedPledge: true,
      name: authForm.name,
      phone: authForm.phone,
      grade: 'UNPAID', // Initial grade
    }));

    // Update Simulated Google Sheets (Step 1 Complete)
    const newIndex = sheetRows.length + 1;
    const newRow: SheetRow = {
      index: newIndex,
      name: authForm.name,
      phone: authForm.phone,
      signUpTime: signUpTimeStr,
      paymentTime: '',
      grade: 'UNPAID',
      contractStatus: 'NONE',
      note: '가입 및 5천만 원 유출 배상 약관 서약 완료 (미결제)'
    };

    setSheetRows(prev => [...prev, newRow]);
    setShowPledgeModal(false);
  };

  // --- 5. Premium Tier Payment Simulator (Step 2) ---
  const handlePayment = (grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP') => {
    if (!userState.isVerified) {
      alert('휴대폰 본인인증 및 보안서약을 완료한 후 결제가 가능합니다.');
      handleStartAuth();
      return;
    }

    setPendingPaymentGrade(grade);
    setCopiedText(false);
    setShowAccountPaymentModal(true);
  };

  const handleConfirmAccountPayment = () => {
    if (!pendingPaymentGrade) return;

    const grade = pendingPaymentGrade;
    const payTimeStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    // Update state to selected grade and start 1-hour timer
    setUserState(prev => ({
      ...prev,
      grade,
      timerSeconds: 3600, // Reset to 1 hour
      timerActive: true,
      isTimerExpired: false,
    }));

    // Real-time synchronization into Simulated Google Sheets
    setSheetRows(prev =>
      prev.map(row =>
        row.phone === userState.phone
          ? {
              ...row,
              grade,
              paymentTime: payTimeStr,
              note: `[결제 시간: ${payTimeStr}] 등급 [${grade}] 실시간 자동 활성화 완료 (1시간 환불 타이머 가동)`
            }
          : row
      )
    );

    setShowAccountPaymentModal(false);
    setPendingPaymentGrade(null);

    // Switch to gallery to show activated brides
    setActiveTab('gallery');
    alert(`🎉 [${grade}] 등급의 무통장 송금 확인 및 승인이 완료되었습니다!\n구글 스프레드시트에 실시간으로 동기화되어 해당 등급 신부 갤러리가 즉시 활성화됩니다.`);
  };

  // --- 6. 1-Hour Refund & Blacklist ban (Step 3 Case A) ---
  const handleRefundClick = () => {
    setShowRefundWarningModal(true);
  };

  const handleConfirmRefund = () => {
    const banTimeStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const userPhone = userState.phone;
    const userName = userState.name;

    // Trigger Permanent Ban on Client Screen
    setUserState(prev => ({
      ...prev,
      grade: 'BLACK',
      timerActive: false,
      isPermanentlyBlocked: true,
    }));

    // [Automation Active]: Set grade to BLACK on G-Sheets, append to Blacklist Sheet
    setSheetRows(prev =>
      prev.map(row =>
        row.phone === userPhone
          ? {
              ...row,
              grade: 'BLACK',
              note: `1시간 이내 환불 요청 - 즉시 영구제명 처리 및 BLACK으로 등급 강제 세팅`
            }
          : row
      )
    );

    const blacklistIndex = blacklistRows.length + 1;
    const newBlackRow: BlacklistRow = {
      index: blacklistIndex,
      name: userName,
      phone: userPhone,
      bannedTime: banTimeStr,
      reason: '1시간 이내 악의적 환불 요청으로 인한 영구 접속 정지 및 재가입 불가 제명'
    };

    setBlacklistRows(prev => [...prev, newBlackRow]);
    setShowRefundWarningModal(false);
    setSelectedBride(null);
  };

  // --- 7. Fast-Forward Timer (Simulate Expiration - Step 3 Case B) ---
  const handleFastForwardTimer = () => {
    setUserState(prev => ({
      ...prev,
      timerSeconds: 5, // Force 5 seconds left to witness transition
      timerActive: true,
    }));
    alert('⏱️ 환불 타이머가 5초 앞으로 고속 강제 전송되었습니다. 5초 뒤 [Case B] 타임아웃 자동화를 관찰해보세요!');
  };

  // --- 8. Meeting Request & SignOK Contract Setup (Step 5) ---
  const handleRequestMeeting = (bride: BrideProfile) => {
    if (!userState.isVerified) {
      alert('신부 정보 보호를 위해 최초 본인인증과 가입 서약이 필요합니다.');
      handleStartAuth();
      return;
    }

    // 1. Married check
    if (bride.isMarried) {
      alert(`🎉 [안내] ${bride.name.split(' (')[0]} 신부님은 이미 매칭을 성사하여 아름다운 가정을 꾸리신 성혼 완료 회원입니다.\n\n해당 신부님과는 더 이상 미팅을 신청하실 수 없습니다. Ace Match에서 또 다른 최고의 인연을 만나실 수 있도록 밀착 성혼 케어 서비스를 적극 지원해 드리겠습니다!`);
      return;
    }

    // 2. Active meeting check
    if (bride.isMeetingWithOther) {
      const confirmMeeting = window.confirm(`⏳ [안내] ${bride.name.split(' (')[0]} 신부님은 현재 다른 신랑 회원님과 현지 대면 미팅 및 상호 교제를 활발히 진행 중입니다.\n\n그럼에도 불구하고 대기 예약(2순위 대기)으로 미팅 신청서를 접수하시겠습니까?\n진행 중인 미팅이 최종 성혼으로 이루어지지 않을 경우, 신청 순서에 따라 즉시 우선 매칭권이 부여됩니다.`);
      if (!confirmMeeting) return;
    }

    // Guard on payment authorization for bride tier
    const isAuthorized = checkTierAuthorization(bride.grade);
    if (!isAuthorized) {
      alert(`[권한 제한] 본 신부님 프로필은 [${bride.grade}] 등급 전용입니다. 멤버십 요금표로 이동합니다.`);
      setActiveTab('membership');
      return;
    }

    setSelectedBride(bride);
    setShowSignOkModal(true);
  };

  // SignOK Complete (Simulate signing and deposit)
  const handleSignOkComplete = () => {
    setUserState(prev => ({
      ...prev,
      contractStatus: 'SIGNED',
      meetingRequestedBrideId: selectedBride?.id || null,
    }));

    // Sync to Sheets that signing completed
    setSheetRows(prev =>
      prev.map(row =>
        row.phone === userState.phone
          ? {
              ...row,
              contractStatus: 'SIGNED',
              note: `SignOK 전자계약 날인 완료 / 착수 계약금 150만 원 입금대기 (사장님 최종 승인 대기)`
            }
          : row
      )
    );

    setShowSignOkModal(false);
    alert('✍️ SignOK 전자계약서 서명 및 계약금 입금 예약이 정상 처리되었습니다.\n\n구글 시트에 [서명완료]로 기록되며, 이제 우측 "구글 시트 모니터" 상단에 표시된 [사장님 승인: [계약완료] 변경] 버튼을 눌러 관리자 수동 승인 단계를 체험해보세요!');
  };

  // Admin approval action in the google sheet
  const handleSetContractCompleted = () => {
    setUserState(prev => ({
      ...prev,
      contractStatus: 'COMPLETED'
    }));

    setSheetRows(prev =>
      prev.map(row =>
        row.phone === userState.phone
          ? {
              ...row,
              contractStatus: 'COMPLETED',
              note: `[성혼 계약완료] 500만 원 입금 매칭 성사! 신부 상세 히든 프로필(사진 10장, 잘로, 사법서류) 자동 잠금 해제`
            }
          : row
      )
    );

    alert('👑 [자동화 발동] 사장님이 구글 시트에서 상태를 [계약완료]로 승인하였습니다!\n\n해당 신랑의 앱 화면 하단에 잠겨 있던 전용 히든 프로필(일상사진 10장, 잘로 폰 영상, 사법 검증 서류)의 철통 보안 락이 실시간으로 해제되었습니다.');
  };

  // --- Admin Console Handlers ---
  const handleAdminFormChange = (key: string, value: any) => {
    setAdminEditForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAdminHiddenPhotoChange = (index: number, value: string) => {
    setAdminEditForm(prev => {
      const updated = [...prev.hiddenPhotos];
      updated[index] = value;
      return { ...prev, hiddenPhotos: updated };
    });
  };

  const handleAdminAddHiddenPhoto = () => {
    setAdminEditForm(prev => ({
      ...prev,
      hiddenPhotos: [...prev.hiddenPhotos, '']
    }));
  };

  const handleAdminRemoveHiddenPhoto = (index: number) => {
    setAdminEditForm(prev => {
      const updated = prev.hiddenPhotos.filter((_, idx) => idx !== index);
      return { ...prev, hiddenPhotos: updated };
    });
  };

  const handleAdminSave = (e: FormEvent) => {
    e.preventDefault();
    setBridalCatalog(prev => prev.map(b => {
      if (b.id === adminSelectedBrideId) {
        const updated: BrideProfile = {
          ...b,
          name: adminEditForm.name,
          age: Number(adminEditForm.age),
          height: Number(adminEditForm.height),
          weight: Number(adminEditForm.weight),
          location: adminEditForm.location,
          grade: adminEditForm.grade,
          avatarUrl: adminEditForm.avatarUrl,
          hiddenPhotos: adminEditForm.hiddenPhotos.filter(p => p.trim() !== ''),
          shortBio: adminEditForm.shortBio,
        };
        // sync currently active selectedBride detail panel if applicable
        if (selectedBride && selectedBride.id === b.id) {
          setSelectedBride(updated);
        }
        return updated;
      }
      return b;
    }));
    alert(`💡 [실시간 동기화 완료] ${adminEditForm.name} 신부님의 사진 및 프로필 정보가 에이스매치 실시간 카탈로그 데이터베이스에 즉시 반영되었습니다.`);
  };

  const handleAdminAddBride = (e: FormEvent) => {
    e.preventDefault();
    if (!newBrideForm.name || !newBrideForm.location) {
      alert('⚠️ 이름과 지역은 필수 입력값입니다.');
      return;
    }
    const newId = 'b_' + Date.now();
    const newBride: BrideProfile = {
      id: newId,
      name: newBrideForm.name,
      age: Number(newBrideForm.age),
      height: Number(newBrideForm.height),
      weight: Number(newBrideForm.weight),
      location: newBrideForm.location,
      grade: newBrideForm.grade,
      avatarUrl: newBrideForm.avatarUrl || 'https://images.unsplash.com/photo-1591555200344-05193517d91e?auto=format&fit=crop&q=80&w=400&h=500',
      bestPhotos: [newBrideForm.avatarUrl || 'https://images.unsplash.com/photo-1591555200344-05193517d91e?auto=format&fit=crop&q=80&w=400&h=500'],
      hiddenPhotos: newBrideForm.hiddenPhotos.filter(p => p.trim() !== ''),
      zaloVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-smiling-at-camera-34546-large.mp4',
      verificationDocUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      shortBio: newBrideForm.shortBio || '한국에서 행복한 결혼생활을 꿈꾸는 예쁜 신부입니다.',
      isNewFace: true,
    };

    setBridalCatalog(prev => [newBride, ...prev]);
    setAdminSelectedBrideId(newId);
    setIsAddingNew(false);
    // Reset newBrideForm
    setNewBrideForm({
      name: '',
      age: 23,
      height: 162,
      weight: 47,
      location: '하노이 (Hanoi)',
      grade: 'BRONZE',
      avatarUrl: 'https://images.unsplash.com/photo-1591555200344-05193517d91e?auto=format&fit=crop&q=80&w=400&h=500',
      hiddenPhotos: [
        'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
        'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400'
      ],
      shortBio: '한국어 공부를 열심히 하며 따뜻한 가정을 이루고 싶습니다.',
    });
    alert(`✨ [신규 등록 완료] 새로운 ${newBride.grade}등급 ${newBride.name} 신부님이 에이스매치 실시간 카탈로그 데이터베이스에 등록되었습니다.`);
  };

  const handleAdminDeleteBride = (id: string) => {
    const targetBride = bridalCatalog.find(b => b.id === id);
    if (!targetBride) return;
    
    if (confirm(`⚠️ 정말로 ${targetBride.name.split(' (')[0]} 신부님을 데이터베이스에서 완전히 영구 삭제하시겠습니까?`)) {
      setBridalCatalog(prev => {
        const updated = prev.filter(b => b.id !== id);
        // Sync selected bride id
        if (updated.length > 0) {
          setAdminSelectedBrideId(updated[0].id);
        } else {
          setAdminSelectedBrideId('');
        }
        return updated;
      });
      if (selectedBride && selectedBride.id === id) {
        setSelectedBride(null);
      }
      alert('🗑️ 신부님 정보가 데이터베이스에서 완전히 삭제되었습니다.');
    }
  };

  // Reset entire simulator
  const handleResetSimulation = () => {
    setUserState({
      isVerified: false,
      hasSignedPledge: false,
      name: '',
      phone: '',
      grade: 'UNPAID',
      timerSeconds: 3600,
      timerActive: false,
      isTimerExpired: false,
      meetingRequestedBrideId: null,
      contractStatus: 'NONE',
      isPermanentlyBlocked: false,
    });
    setAuthForm({ name: '', phone: '' });
    setSelectedBride(null);
    setActiveTab('gallery');
    setActiveVideoUrl(null);
    setShowDocModal(false);
    setActiveHiddenPhotoIndex(null);
    setSheetRows([
      {
        index: 1,
        name: '홍길동',
        phone: '010-1234-5678',
        signUpTime: '2026-07-05 09:12',
        paymentTime: '2026-07-05 10:15',
        grade: 'VIP',
        contractStatus: 'NONE',
        note: '전속 VIP 매칭 완료 및 현지 가이드 상담 진행 중'
      },
      {
        index: 2,
        name: '이도령',
        phone: '010-9876-5432',
        signUpTime: '2026-07-05 11:45',
        paymentTime: '',
        grade: 'UNPAID',
        contractStatus: 'NONE',
        note: '본인인증 완료, 멤버십 갤러리 서약 대기 중'
      }
    ]);
  };

  // Grade vs. Bride authorization logic
  const checkTierAuthorization = (brideGrade: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP'): boolean => {
    const gradeScores: Record<MembershipGrade, number> = {
      'UNPAID': 0,
      'BRONZE': 1,
      'SILVER': 2,
      'GOLD': 3,
      'VIP': 4,
      'BLACK': -1
    };

    const brideScores = {
      'BRONZE': 1,
      'SILVER': 2,
      'GOLD': 3,
      'VIP': 4
    };

    return gradeScores[userState.grade] >= brideScores[brideGrade];
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-gray-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200 relative overflow-x-hidden">
      
      {/* ----------------- GLOBAL FLOATING MOSAIC PORTRAITS BACKGROUND ----------------- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-[0.06] z-0" id="global-mosaic-background">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-500/20 blur-[130px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-amber-600/10 blur-[150px]" />
        
        {/* Floating Locked Mosaic Portrait 1 */}
        <div className="absolute top-[12%] left-[4%] w-56 h-72 rounded-3xl border border-white/10 overflow-hidden rotate-[-8deg] shadow-2xl hidden lg:block">
          <img 
            src="/src/assets/images/bride_bronze_portrait_1783283426628.jpg" 
            alt="background preview 1" 
            className="w-full h-full object-cover blur-[14px] scale-110 filter saturate-[1.2]"
            referrerPolicy="no-referrer"
          />
          {/* Mosaic Grid Line Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.6)_3px,transparent_3px),linear-gradient(90deg,rgba(0,0,0,0.6)_3px,transparent_3px)] bg-[size:12px_12px]" />
        </div>

        {/* Floating Locked Mosaic Portrait 2 */}
        <div className="absolute bottom-[10%] right-[3%] w-60 h-80 rounded-3xl border border-white/10 overflow-hidden rotate-[6deg] shadow-2xl hidden lg:block">
          <img 
            src="/src/assets/images/bride_silver_portrait_1783283416192.jpg" 
            alt="background preview 2" 
            className="w-full h-full object-cover blur-[16px] scale-110 filter saturate-[1.2]"
            referrerPolicy="no-referrer"
          />
          {/* Mosaic Grid Line Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.6)_3px,transparent_3px),linear-gradient(90deg,rgba(0,0,0,0.6)_3px,transparent_3px)] bg-[size:12px_12px]" />
        </div>

        {/* Floating Locked Mosaic Portrait 3 */}
        <div className="absolute top-[45%] right-[6%] w-48 h-64 rounded-3xl border border-white/10 overflow-hidden rotate-[-4deg] shadow-2xl hidden xl:block">
          <img 
            src="/src/assets/images/bride_gold_portrait_1783283391741.jpg" 
            alt="background preview 3" 
            className="w-full h-full object-cover blur-[15px] scale-110 filter saturate-[1.2]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.6)_3px,transparent_3px),linear-gradient(90deg,rgba(0,0,0,0.6)_3px,transparent_3px)] bg-[size:10px_10px]" />
        </div>
      </div>
      
      {/* ----------------- IF BLOCKED SCREEN (Step 3 Case A Blacklist) ----------------- */}
      {userState.isPermanentlyBlocked && (
        <div className="fixed inset-0 bg-[#070707] z-50 flex items-center justify-center p-4" id="permanently-banned-screen">
          <div className="max-w-md w-full bg-[#111111] border border-red-900 rounded-2xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-red-600"></div>
            <div className="w-16 h-16 bg-red-950/50 border border-red-500/30 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 animate-bounce" />
            </div>
            
            <h1 className="text-2xl font-serif font-semibold text-red-500 tracking-tight mb-3">
              기기 접속 영구 차단 안내
            </h1>
            
            <p className="text-gray-400 text-sm leading-relaxed mb-6 font-sans">
              회원님(<span className="text-red-400 font-semibold">{userState.name || '미인증'}</span>)의 연락처(<span className="text-red-400 font-semibold">{userState.phone}</span>) 및 해당 기기 접속 로그는 <strong>1시간 이내 환불 조항 약용</strong> 또는 <strong>계약 위반 이력</strong>으로 인해 <span className="text-red-500 font-semibold underline">구글 빌더 블랙리스트 시트</span>에 강제 전송·기록되었으며, 매칭 플랫폼 전체에 대한 액세스가 **영구 차단**되었습니다.
            </p>

            <div className="bg-[#1A1A1A] rounded-xl p-4 text-left border border-red-950 mb-6">
              <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                <span>차단 일시</span>
                <span className="text-gray-400">2026-07-05 13:29 (서버 시각)</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-2 font-mono">
                <span>위반 사유</span>
                <span className="text-red-400 font-medium">1시간 이내 환불 규정 남용 (BLACK)</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 font-mono">
                <span>법적 근거</span>
                <span className="text-amber-500">가입 서약 제3조 손해배상 소송 청구</span>
              </div>
            </div>

            <button
              onClick={handleResetSimulation}
              className="w-full bg-[#1A1A1A] hover:bg-[#252525] text-gray-300 font-sans text-xs font-semibold py-3 px-4 rounded-xl border border-neutral-800 transition-colors flex items-center justify-center gap-2"
              id="blocked-retry-btn"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              체험 시뮬레이션 다시 시작하기
            </button>
          </div>
        </div>
      )}

      {/* ----------------- APP HEADER ----------------- */}
      <header className="bg-[#0D0D0D] border-b border-[#1E1E1E] sticky top-0 z-40 px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/10">
              <ShieldCheck className="w-5 h-5 text-black stroke-[2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-lg tracking-widest text-amber-500">ACE</span>
                <span className="text-xs bg-[#1E1E1E] text-amber-400/80 border border-amber-500/20 px-2 py-0.5 rounded font-mono font-bold">CONFIDENTIAL</span>
              </div>
              <p className="text-[10px] text-gray-500 font-sans">에이스 매치 최저가 서약 기반 보안 매칭 플랫폼</p>
            </div>
          </div>

          {/* KakaoTalk Consult Button */}
          <a
            href="https://open.kakao.com/o/sP2sKxAh"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 bg-[#FEE500] hover:bg-[#FEE500]/90 text-[#191919] font-sans text-xs font-black px-4 py-2.5 rounded-xl shadow-lg shadow-[#FEE500]/5 transition-all transform hover:scale-[1.03] md:ml-auto border border-[#E0C900]"
            id="kakaotalk-consult-button"
          >
            <svg className="w-3.5 h-3.5 fill-current text-[#191919]" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 3.185-9 7.115 0 2.557 1.707 4.8 4.34 6.011l-.85 3.125a.36.36 0 0 0 .54.387l3.682-2.433c.422.066.853.1 1.288.1 4.97 0 9-3.185 9-7.115S16.97 3 12 3z"/>
            </svg>
            <span>카톡 실시간 상담</span>
          </a>

          {/* User Status Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-[#131313] px-4 py-2 rounded-xl border border-[#222222]">
            {userState.isVerified ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-sans font-semibold text-xs text-gray-200">
                    {userState.name} 신랑님
                  </span>
                  <span className="text-[10px] text-gray-500">({userState.phone})</span>
                </div>

                <div className="h-4 w-px bg-[#262626]"></div>

                {/* Grade Badge */}
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-amber-400">
                    {userState.grade === 'UNPAID' ? '일반회원 (미결제)' : `${userState.grade} 등급`}
                  </span>
                </div>

                {/* Step 3 Timer UI */}
                {userState.timerActive && (
                  <>
                    <div className="h-4 w-px bg-[#262626]"></div>
                    <div className="flex items-center gap-1.5 bg-amber-950/40 border border-amber-800/30 px-2.5 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                      <span className="text-[11px] font-mono text-amber-400 font-bold">
                        환불 가능 시간: {formatTime(userState.timerSeconds)} 남음
                      </span>
                      {!userState.isTimerExpired && (
                        <button
                          onClick={handleRefundClick}
                          className="bg-red-950 hover:bg-red-900 border border-red-800 text-red-300 text-[10px] px-2 py-0.5 rounded ml-2 transition-colors"
                          id="trigger-refund-btn"
                        >
                          환불 신청
                        </button>
                      )}
                    </div>
                  </>
                )}

                {/* If Timer Expired (Step 3 Case B) */}
                {userState.isTimerExpired && userState.grade !== 'UNPAID' && (
                  <>
                    <div className="h-4 w-px bg-[#262626]"></div>
                    <div className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-lg">
                      <LockKeyhole className="w-3 h-3 text-gray-500" />
                      <span className="text-[10px] font-sans text-gray-400">
                        서비스 이용 완료 (환불 요청 불가 고정)
                      </span>
                    </div>
                  </>
                )}

                <button 
                  onClick={handleResetSimulation}
                  className="text-gray-500 hover:text-gray-300 transition-colors ml-1"
                  title="인증 로그아웃"
                  id="header-logout-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">🚨 현재 로그인 전으로 신부 정보를 보호합니다.</span>
                <button
                  onClick={handleStartAuth}
                  className="bg-amber-500 hover:bg-amber-400 text-black font-sans text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-lg shadow-amber-500/10 transition-all"
                  id="header-auth-btn"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  휴대폰 본인인증 및 가입
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ----------------- SUB-NAVIGATION BAR ----------------- */}
      <div className="bg-[#0A0A0A] border-b border-[#1A1A1A] px-4 md:px-8 py-1">
        <div className="max-w-7xl mx-auto flex gap-4">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`py-3 px-2 border-b-2 text-xs font-sans font-semibold tracking-wide transition-all ${
              activeTab === 'gallery'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
            id="nav-gallery"
          >
            신부 갤러리 (Bride Gallery)
          </button>
          <button
            onClick={() => setActiveTab('membership')}
            className={`py-3 px-2 border-b-2 text-xs font-sans font-semibold tracking-wide transition-all ${
              activeTab === 'membership'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
            id="nav-membership"
          >
            멤버십 요금표 (Pricing)
          </button>
          <button
            onClick={() => setActiveTab('pledge_info')}
            className={`py-3 px-2 border-b-2 text-xs font-sans font-semibold tracking-wide transition-all ${
              activeTab === 'pledge_info'
                ? 'border-amber-500 text-amber-500'
                : 'border-transparent text-gray-400 hover:text-gray-200'
            }`}
            id="nav-security-info"
          >
            5천만 원 유출 보안서약 규정
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-3 px-2 border-b-2 text-xs font-sans font-semibold tracking-wide transition-all ${
              activeTab === 'admin'
                ? 'border-amber-500 text-amber-500 font-extrabold'
                : 'border-transparent text-amber-500/60 hover:text-amber-400'
            }`}
            id="nav-admin-console"
          >
            👑 관리자메뉴 (Admin Panel)
          </button>
        </div>
      </div>

      {/* ----------------- MAIN CONTENTS (SPLIT VIEW) ----------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Section: Matchmaking Client Area (70% on desktop) */}
        <section className="flex-1 flex flex-col gap-6" id="client-app-viewport">
          
          <AnimatePresence mode="wait">
            
            {/* 1. MEMBERSHIP TAB */}
            {activeTab === 'membership' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
                id="membership-pricing-section"
              >
                <div className="text-center max-w-xl mx-auto py-4">
                  <Award className="w-10 h-10 text-amber-500 mx-auto mb-3" />
                  <h2 className="text-2xl font-serif font-bold text-gray-100 tracking-tight">프리미엄 보안 등급 요금제</h2>
                  <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">
                    본 플랫폼은 고품격 신부 프라이버시 보호 및 손해배상 제도의 철저한 작동을 위해 등급별 결제제를 채택하고 있습니다. 등급 결제 즉시 구글 스프레드시트에 동기화되며 갤러리가 즉시 오픈됩니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MEMBERSHIP_TIERS.map(tier => (
                    <div 
                      key={tier.id}
                      className={`bg-[#111111] border rounded-2xl p-5 flex flex-col justify-between transition-all ${
                        userState.grade === tier.id 
                          ? 'border-amber-500 shadow-xl shadow-amber-500/5 bg-gradient-to-b from-amber-950/10 to-[#111111]' 
                          : 'border-neutral-800 hover:border-neutral-700'
                      }`}
                      id={`tier-card-${tier.id}`}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <span className="font-sans font-bold text-sm text-amber-400">{tier.name}</span>
                          {userState.grade === tier.id && (
                            <span className="bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                              Active (이용 중)
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-gray-200 mb-1">{tier.priceText}</h3>
                        <p className="text-xs text-gray-400 mb-4">{tier.desc}</p>
                      </div>

                      <button
                        onClick={() => handlePayment(tier.id as any)}
                        className={`w-full font-sans text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                          userState.grade === tier.id
                            ? 'bg-amber-500 text-black font-extrabold cursor-default'
                            : 'bg-[#1E1E1E] hover:bg-[#252525] text-gray-200 border border-neutral-800'
                        }`}
                        id={`pay-btn-${tier.id}`}
                      >
                        {userState.grade === tier.id ? '이용 권한 활성화 완료' : '카드 결제 시뮬레이션'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Interactive Demo Tips */}
                <div className="bg-[#121212] border border-[#222222] rounded-xl p-4 flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-sans font-semibold text-xs text-amber-500 block mb-0.5">💡 결제 자동화 시뮬레이션 가이드</span>
                    <span className="text-[11px] text-gray-400 leading-relaxed">
                      임의의 등급을 결제하면 우측 <strong>신랑 회원 시트</strong>의 등급이 결제시간과 함께 실시간으로 변경 기재되고, 해당 등급의 신부 카드가 즉시 활성화됩니다. 결제 후 <strong>1시간 환불 타이머</strong>가 상단에 시작됩니다.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 4. ADMIN TAB */}
            {activeTab === 'admin' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
                id="admin-console-section"
              >
                <div className="bg-[#111111] border border-neutral-800 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-500"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-5 mb-5">
                    <div>
                      <h2 className="text-xl font-serif font-black text-gray-100 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-amber-500" />
                        에이스매치 백오피스: 신부 사진 및 프로필 수정 콘솔
                      </h2>
                      <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                        신부님들의 메인 포트레이트 및 미팅 계약 체결 후 잠금해제되는 일상 사진 10장(히든 사진)을 실시간으로 교체/추가/삭제할 수 있는 관리자 전용 채널입니다.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left Panel: Bride Selection List (4 cols) */}
                    <div className="lg:col-span-4 bg-[#0A0A0A] border border-neutral-800 rounded-xl p-4 flex flex-col gap-3 max-h-[620px]">
                      
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                        <div className="text-xs font-sans font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Sliders className="w-4 h-4" />
                          신부 목록 ({bridalCatalog.length}명)
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsAddingNew(true);
                            setNewBrideForm({
                              name: '',
                              age: 23,
                              height: 162,
                              weight: 47,
                              location: '하노이 (Hanoi)',
                              grade: 'BRONZE',
                              avatarUrl: 'https://images.unsplash.com/photo-1591555200344-05193517d91e?auto=format&fit=crop&q=80&w=400&h=500',
                              hiddenPhotos: [
                                'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
                                'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400'
                              ],
                              shortBio: '한국어 공부를 열심히 하며 따뜻한 가정을 이루고 싶습니다.',
                            });
                          }}
                          className="bg-amber-600/15 hover:bg-amber-600/30 text-amber-400 text-[10px] font-sans font-extrabold px-2 py-1 rounded border border-amber-500/20 flex items-center gap-1 transition-all"
                        >
                          <Plus className="w-3 h-3" />
                          신규 등록
                        </button>
                      </div>

                      {/* Grade Filtration Menu */}
                      <div className="flex flex-wrap gap-1 bg-[#121212] p-1 rounded-lg border border-neutral-900">
                        {(['ALL', 'BRONZE', 'SILVER', 'GOLD', 'VIP'] as const).map(g => {
                          const isActive = adminGradeFilter === g;
                          const count = g === 'ALL'
                            ? bridalCatalog.length
                            : bridalCatalog.filter(b => b.grade === g).length;
                          return (
                            <button
                              key={g}
                              type="button;}"
                              onClick={() => setAdminGradeFilter(g)}
                              className={`flex-1 text-[10px] font-sans font-bold py-1 px-1 rounded transition-all text-center whitespace-nowrap ${
                                isActive
                                  ? 'bg-amber-500 text-black shadow-sm'
                                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1C1C1C]'
                              }`}
                            >
                              {g}({count})
                            </button>
                          );
                        })}
                      </div>

                      {/* Search Bar */}
                      <input
                        type="text"
                        placeholder="이름 또는 지역 검색..."
                        value={adminSearchQuery}
                        onChange={(e) => setAdminSearchQuery(e.target.value)}
                        className="w-full bg-[#141414] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors"
                      />

                      {/* Bride Scroll list */}
                      <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar max-h-[440px]">
                        {bridalCatalog
                          .filter(b => {
                            const matchesSearch = b.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || 
                                                  b.location.toLowerCase().includes(adminSearchQuery.toLowerCase());
                            const matchesGrade = adminGradeFilter === 'ALL' || b.grade === adminGradeFilter;
                            return matchesSearch && matchesGrade;
                          })
                          .map(b => {
                            const isSel = b.id === adminSelectedBrideId && !isAddingNew;
                            return (
                              <button
                                key={b.id}
                                type="button"
                                onClick={() => {
                                  setAdminSelectedBrideId(b.id);
                                  setIsAddingNew(false);
                                }}
                                className={`w-full text-left p-2.5 rounded-lg border transition-all flex items-center gap-2.5 ${
                                  isSel
                                    ? 'bg-amber-950/20 border-amber-500/80 text-amber-400'
                                    : 'bg-[#121212]/50 border-neutral-900 text-gray-400 hover:border-neutral-800 hover:bg-[#141414]'
                                }`}
                              >
                                <img
                                  src={b.avatarUrl}
                                  alt={b.name}
                                  className="w-9 h-12 object-cover rounded bg-neutral-900 flex-shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="min-w-0 flex-1">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-mono text-gray-500 uppercase tracking-wider">{b.grade}</span>
                                    {b.isMarried && <span className="text-[8px] bg-emerald-950 text-emerald-400 border border-emerald-900 px-1 rounded">성혼 💍</span>}
                                    {b.isMeetingWithOther && !b.isMarried && <span className="text-[8px] bg-rose-950 text-rose-400 border border-rose-900 px-1 rounded">미팅 ⏳</span>}
                                  </div>
                                  <h4 className="text-xs font-sans font-bold text-gray-200 truncate mt-0.5">{b.name.split(' (')[0]}</h4>
                                  <p className="text-[10px] text-gray-500 truncate mt-0.5">{b.age}세 / {b.location.split(' ')[0]}</p>
                                </div>
                              </button>
                            );
                          })}
                        {bridalCatalog.filter(b => {
                          const matchesSearch = b.name.toLowerCase().includes(adminSearchQuery.toLowerCase()) || 
                                                b.location.toLowerCase().includes(adminSearchQuery.toLowerCase());
                          const matchesGrade = adminGradeFilter === 'ALL' || b.grade === adminGradeFilter;
                          return matchesSearch && matchesGrade;
                        }).length === 0 && (
                          <div className="text-center py-10 text-gray-600 text-xs font-sans">
                            해당 등급/검색어에 일치하는 신부가 없습니다.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Panel: Editor or Add Form (8 cols) */}
                    <div className="lg:col-span-8 bg-[#0D0D0D] border border-neutral-800 rounded-xl p-4 md:p-5 flex flex-col gap-4">
                      
                      {isAddingNew ? (
                        <>
                          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                            <div className="flex items-center gap-1.5">
                              <Plus className="w-4 h-4 text-emerald-500 animate-pulse" />
                              <span className="text-xs font-sans font-bold text-gray-200">
                                ✨ 신규 신부 프로필 데이터베이스 등록 (새 프로필 추가)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setIsAddingNew(false)}
                              className="text-[10.5px] text-amber-500 hover:text-amber-400 font-bold flex items-center gap-1 transition-colors"
                            >
                              수정 모드로 전환
                            </button>
                          </div>

                          <form onSubmit={handleAdminAddBride} className="space-y-4">
                            
                            {/* Avatar photo editor */}
                            <div className="bg-[#121212]/50 border border-neutral-900 rounded-xl p-4">
                              <h4 className="text-xs font-sans font-bold text-emerald-500 mb-3 flex items-center gap-1">
                                <Image className="w-3.5 h-3.5" />
                                1. 대표 메인 사진 등록
                              </h4>
                              <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="relative w-24 h-32 bg-[#0E0E0E] rounded-lg overflow-hidden border border-neutral-800 flex-shrink-0">
                                  <img
                                    src={newBrideForm.avatarUrl || 'https://images.unsplash.com/photo-1591555200344-05193517d91e?auto=format&fit=crop&q=80&w=400&h=500'}
                                    alt="avatar preview"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                
                                <div className="flex-1 w-full space-y-3">
                                  <div>
                                    <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">메인 대표 이미지 URL</label>
                                    <input
                                      type="text"
                                      required
                                      value={newBrideForm.avatarUrl}
                                      onChange={(e) => setNewBrideForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
                                      className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
                                      placeholder="https://..."
                                    />
                                  </div>

                                  {/* Unsplash Presets */}
                                  <div>
                                    <span className="block text-[10px] font-sans font-semibold text-gray-500 mb-1.5">💡 고품질 원클릭 포트레이트 이미지 프리셋 교체</span>
                                    <div className="grid grid-cols-5 gap-2">
                                      {[
                                        'https://images.unsplash.com/photo-1591555200344-05193517d91e', // wedding dress
                                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330', // studio 1
                                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb', // studio 2
                                        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1', // modern
                                        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91'  // classic
                                      ].map((url, index) => {
                                        const fullUrl = `${url}?auto=format&fit=crop&q=80&w=400&h=500`;
                                        const isCurrent = newBrideForm.avatarUrl === fullUrl;
                                        return (
                                          <button
                                            type="button"
                                            key={index}
                                            onClick={() => setNewBrideForm(prev => ({ ...prev, avatarUrl: fullUrl }))}
                                            className={`relative aspect-square rounded-md overflow-hidden bg-neutral-900 border transition-all ${
                                              isCurrent ? 'ring-2 ring-emerald-500 border-emerald-500 scale-[1.05]' : 'border-neutral-800 hover:border-neutral-600'
                                            }`}
                                          >
                                            <img src={fullUrl} alt={`Preset ${index+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            <div className="absolute inset-0 bg-black/30 hover:bg-transparent transition-colors flex items-center justify-center">
                                              <span className="text-[9px] font-sans font-bold text-white shadow-sm">P{index+1}</span>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Hidden photos list creator */}
                            <div className="bg-[#121212]/50 border border-neutral-900 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3 border-b border-neutral-800/50 pb-2">
                                <h4 className="text-xs font-sans font-bold text-emerald-500 flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  2. 미팅 서명 및 계약 후 해제되는 일상 사진들 (히든 사진)
                                </h4>
                                
                                <button
                                  type="button"
                                  onClick={() => setNewBrideForm(prev => ({ ...prev, hiddenPhotos: [...prev.hiddenPhotos, ''] }))}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  일상 사진 추가
                                </button>
                              </div>

                              <p className="text-[10px] text-gray-500 leading-normal mb-3">
                                실제 신부의 일상 생활 컷 사진들을 등록합니다. (기본으로 데모 사진이 자동 지원됩니다)
                              </p>

                              <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                                {newBrideForm.hiddenPhotos.map((url, idx) => (
                                  <div key={idx} className="flex gap-2.5 items-center bg-[#161616] border border-neutral-850 p-2 rounded-lg">
                                    <div className="relative w-10 h-10 rounded bg-neutral-900 overflow-hidden border border-neutral-850 flex-shrink-0">
                                      {url ? (
                                        <img
                                          src={url}
                                          alt={`Hidden preview ${idx}`}
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-gray-700 text-[10px]">빈 슬롯</div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <label className="block text-[9px] font-mono text-gray-500 mb-0.5">일상 히든 컷 {idx + 1}</label>
                                      <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => {
                                          const updated = [...newBrideForm.hiddenPhotos];
                                          updated[idx] = e.target.value;
                                          setNewBrideForm(prev => ({ ...prev, hiddenPhotos: updated }));
                                        }}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full bg-[#111111] border border-neutral-800 rounded px-2 py-1 text-[10.5px] text-gray-200 font-mono focus:outline-none focus:border-emerald-500"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const pool = [
                                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400'
                                          ];
                                          const randUrl = pool[(idx + 1) % pool.length];
                                          const updated = [...newBrideForm.hiddenPhotos];
                                          updated[idx] = randUrl;
                                          setNewBrideForm(prev => ({ ...prev, hiddenPhotos: updated }));
                                        }}
                                        className="text-[9px] bg-[#222] hover:bg-[#333] border border-neutral-700 text-gray-300 font-semibold px-1.5 py-0.5 rounded"
                                      >
                                        무작위
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const updated = newBrideForm.hiddenPhotos.filter((_, i) => i !== idx);
                                          setNewBrideForm(prev => ({ ...prev, hiddenPhotos: updated }));
                                        }}
                                        className="text-[9px] bg-red-950/40 hover:bg-red-950 text-red-400 font-semibold px-1.5 py-0.5 rounded border border-red-900/30 flex items-center justify-center"
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                {newBrideForm.hiddenPhotos.length === 0 && (
                                  <div className="text-center py-6 border border-dashed border-neutral-800 rounded-lg text-gray-600 text-xs font-sans">
                                    등록된 일상 사진이 없습니다. 상단의 '일상 사진 추가'를 클릭해 주세요.
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Details: Name, Grade, Age, Location */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#121212]/50 border border-neutral-900 p-4 rounded-xl">
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">이름</label>
                                <input
                                  type="text"
                                  required
                                  value={newBrideForm.name}
                                  onChange={(e) => setNewBrideForm(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                  placeholder="예: 민희 (Minh)"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">등급</label>
                                <select
                                  value={newBrideForm.grade}
                                  onChange={(e) => setNewBrideForm(prev => ({ ...prev, grade: e.target.value as any }))}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                >
                                  <option value="BRONZE">BRONZE</option>
                                  <option value="SILVER">SILVER</option>
                                  <option value="GOLD">GOLD</option>
                                  <option value="VIP">VIP</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">나이 (세)</label>
                                <input
                                  type="number"
                                  required
                                  value={newBrideForm.age}
                                  onChange={(e) => setNewBrideForm(prev => ({ ...prev, age: Number(e.target.value) }))}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">지역</label>
                                <input
                                  type="text"
                                  required
                                  value={newBrideForm.location}
                                  onChange={(e) => setNewBrideForm(prev => ({ ...prev, location: e.target.value }))}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                  placeholder="예: 하이퐁 (Hai Phong)"
                                />
                              </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider">한 줄 자기소개</label>
                              <textarea
                                value={newBrideForm.shortBio}
                                onChange={(e) => setNewBrideForm(prev => ({ ...prev, shortBio: e.target.value }))}
                                rows={2}
                                className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-gray-200 resize-none focus:outline-none focus:border-emerald-500"
                                placeholder="한국에서 좋은 인연을 찾아 진솔하게 대화하고 싶습니다."
                              />
                            </div>

                            <div className="pt-2 flex gap-3">
                              <button
                                type="button"
                                onClick={() => setIsAddingNew(false)}
                                className="bg-[#1E1E1E] hover:bg-[#252525] text-gray-300 font-sans text-xs font-bold py-3 px-5 rounded-xl border border-neutral-800 transition-all"
                              >
                                취소
                              </button>
                              <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-sans text-xs font-bold py-3 px-4 rounded-xl shadow-lg shadow-emerald-500/5 flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Plus className="w-4 h-4 text-black" />
                                새로운 신부 등록 완료 및 데이터베이스 추가
                              </button>
                            </div>
                          </form>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                            <div className="flex items-center gap-1.5">
                              <Edit className="w-4 h-4 text-amber-500" />
                              <span className="text-xs font-sans font-bold text-gray-200">
                                [{adminEditForm.grade} 등급] {adminEditForm.name.split(' (')[0]} 프로필 사진 정보 편집
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500">ID: {adminSelectedBrideId}</span>
                          </div>

                          <form onSubmit={handleAdminSave} className="space-y-4">
                            
                            {/* Avatar photo editor */}
                            <div className="bg-[#121212]/50 border border-neutral-900 rounded-xl p-4">
                              <h4 className="text-xs font-sans font-bold text-amber-500 mb-3 flex items-center gap-1">
                                <Image className="w-3.5 h-3.5" />
                                1. 대표 메인 사진 편집
                              </h4>
                              <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="relative w-24 h-32 bg-[#0E0E0E] rounded-lg overflow-hidden border border-neutral-800 flex-shrink-0">
                                  <img
                                    src={adminEditForm.avatarUrl || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=500'}
                                    alt="avatar preview"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                
                                <div className="flex-1 w-full space-y-3">
                                  <div>
                                    <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">메인 대표 이미지 URL</label>
                                    <input
                                      type="text"
                                      required
                                      value={adminEditForm.avatarUrl}
                                      onChange={(e) => handleAdminFormChange('avatarUrl', e.target.value)}
                                      className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-gray-200 font-mono focus:outline-none focus:border-amber-500 transition-colors"
                                      placeholder="https://..."
                                    />
                                  </div>

                                  {/* Unsplash Presets */}
                                  <div>
                                    <span className="block text-[10px] font-sans font-semibold text-gray-500 mb-1.5">💡 고품질 원클릭 포트레이트 이미지 프리셋 교체</span>
                                    <div className="grid grid-cols-5 gap-2">
                                      {[
                                        'https://images.unsplash.com/photo-1591555200344-05193517d91e', // wedding dress
                                        'https://images.unsplash.com/photo-1494790108377-be9c29b29330', // studio 1
                                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb', // studio 2
                                        'https://images.unsplash.com/photo-1524504388940-b1c1722653e1', // modern
                                        'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91'  // classic
                                      ].map((url, index) => {
                                        const fullUrl = `${url}?auto=format&fit=crop&q=80&w=400&h=500`;
                                        const isCurrent = adminEditForm.avatarUrl === fullUrl;
                                        return (
                                          <button
                                            type="button"
                                            key={index}
                                            onClick={() => handleAdminFormChange('avatarUrl', fullUrl)}
                                            className={`relative aspect-square rounded-md overflow-hidden bg-neutral-900 border transition-all ${
                                              isCurrent ? 'ring-2 ring-amber-500 border-amber-500 scale-[1.05]' : 'border-neutral-800 hover:border-neutral-600'
                                            }`}
                                          >
                                            <img src={fullUrl} alt={`Preset ${index+1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                            <div className="absolute inset-0 bg-black/30 hover:bg-transparent transition-colors flex items-center justify-center">
                                              <span className="text-[9px] font-sans font-bold text-white shadow-sm">P{index+1}</span>
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Hidden photos list creator */}
                            <div className="bg-[#121212]/50 border border-neutral-900 rounded-xl p-4">
                              <div className="flex items-center justify-between mb-3 border-b border-neutral-800/50 pb-2">
                                <h4 className="text-xs font-sans font-bold text-amber-500 flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5" />
                                  2. 미팅 서명 및 계약 후 해제되는 일상 사진들 (히든 사진)
                                </h4>
                                
                                <button
                                  type="button"
                                  onClick={handleAdminAddHiddenPhoto}
                                  className="bg-amber-600 hover:bg-amber-500 text-black font-sans text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                  새 일상 사진 추가
                                </button>
                              </div>

                              <p className="text-[10px] text-gray-500 leading-normal mb-3">
                                실제 신부의 일상 생활 컷 사진들을 등록합니다. (기본으로 데모 사진이 자동 지원됩니다)
                              </p>

                              <div className="space-y-3.5 max-h-[160px] overflow-y-auto pr-1">
                                {adminEditForm.hiddenPhotos.map((url, idx) => (
                                  <div key={idx} className="flex gap-2.5 items-center bg-[#161616] border border-neutral-850 p-2 rounded-lg">
                                    <div className="relative w-10 h-10 rounded bg-neutral-900 overflow-hidden border border-neutral-850 flex-shrink-0">
                                      {url ? (
                                        <img
                                          src={url}
                                          alt={`Hidden preview ${idx}`}
                                          className="w-full h-full object-cover"
                                          referrerPolicy="no-referrer"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-neutral-950 text-gray-700 text-[10px]">빈 슬롯</div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <label className="block text-[9px] font-mono text-gray-500 mb-0.5">일상 히든 컷 {idx + 1}</label>
                                      <input
                                        type="text"
                                        value={url}
                                        onChange={(e) => handleAdminHiddenPhotoChange(idx, e.target.value)}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full bg-[#111111] border border-neutral-800 rounded px-2 py-1 text-[10.5px] text-gray-200 font-mono focus:outline-none focus:border-amber-500"
                                      />
                                    </div>

                                    <div className="flex flex-col gap-1 shrink-0">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const pool = [
                                            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400',
                                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400'
                                          ];
                                          const randUrl = pool[(idx + 3) % pool.length];
                                          handleAdminHiddenPhotoChange(idx, randUrl);
                                        }}
                                        className="text-[9px] bg-[#222] hover:bg-[#333] border border-neutral-700 text-gray-300 font-semibold px-1.5 py-0.5 rounded"
                                        title="랜덤 Unsplash 고화질 인물 사진"
                                      >
                                        무작위
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleAdminRemoveHiddenPhoto(idx)}
                                        className="text-[9px] bg-red-950/40 hover:bg-red-950 text-red-400 font-semibold px-1.5 py-0.5 rounded border border-red-900/30 flex items-center justify-center"
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}

                                {adminEditForm.hiddenPhotos.length === 0 && (
                                  <div className="text-center py-6 border border-dashed border-neutral-800 rounded-lg text-gray-600 text-xs font-sans">
                                    등록된 일상 사진이 없습니다. 상단의 '새 일상 사진 추가'를 클릭해 주세요.
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Details: Name, Grade, Age, Location, Height, Weight */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 bg-[#121212]/50 border border-neutral-900 p-4 rounded-xl">
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">이름</label>
                                <input
                                  type="text"
                                  required
                                  value={adminEditForm.name}
                                  onChange={(e) => handleAdminFormChange('name', e.target.value)}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">등급</label>
                                <select
                                  value={adminEditForm.grade}
                                  onChange={(e) => handleAdminFormChange('grade', e.target.value)}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                >
                                  <option value="BRONZE">BRONZE</option>
                                  <option value="SILVER">SILVER</option>
                                  <option value="GOLD">GOLD</option>
                                  <option value="VIP">VIP</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">나이 (세)</label>
                                <input
                                  type="number"
                                  required
                                  value={adminEditForm.age}
                                  onChange={(e) => handleAdminFormChange('age', Number(e.target.value))}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">지역</label>
                                <input
                                  type="text"
                                  required
                                  value={adminEditForm.location}
                                  onChange={(e) => handleAdminFormChange('location', e.target.value)}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">신장 (cm)</label>
                                <input
                                  type="number"
                                  required
                                  value={adminEditForm.height || 162}
                                  onChange={(e) => handleAdminFormChange('height', Number(e.target.value))}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-sans font-bold text-gray-500 mb-1 uppercase tracking-wider">체중 (kg)</label>
                                <input
                                  type="number"
                                  required
                                  value={adminEditForm.weight || 47}
                                  onChange={(e) => handleAdminFormChange('weight', Number(e.target.value))}
                                  className="w-full bg-[#161616] border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-200"
                                />
                              </div>
                            </div>

                            {/* Bio & Actions */}
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-sans font-bold text-gray-500 uppercase tracking-wider">한 줄 자기소개</label>
                              <textarea
                                value={adminEditForm.shortBio}
                                onChange={(e) => handleAdminFormChange('shortBio', e.target.value)}
                                rows={2}
                                className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-3 py-2 text-xs text-gray-200 resize-none focus:outline-none focus:border-amber-500"
                              />
                            </div>

                            <div className="pt-2 flex gap-3">
                              {bridalCatalog.length > 0 && (
                                <button
                                  type="button"
                                  onClick={() => handleAdminDeleteBride(adminSelectedBrideId)}
                                  className="bg-red-950/40 hover:bg-red-950 text-red-400 font-sans text-xs font-bold py-3 px-4 rounded-xl border border-red-900/40 transition-all flex items-center justify-center gap-1.5"
                                >
                                  <Trash2 className="w-4 h-4 text-red-400" />
                                  선택된 신부 삭제
                                </button>
                              )}
                              <button
                                type="submit"
                                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-sans text-xs font-bold py-3 px-4 rounded-xl shadow-lg shadow-amber-500/5 flex items-center justify-center gap-1.5 transition-all"
                              >
                                <Save className="w-4 h-4 text-black" />
                                선택된 신부 사진 및 프로필 실시간 저장 업데이트
                              </button>
                            </div>

                          </form>

                        </>
                      )}

                    </div>

                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. PLEDGE SECURITY INFOGRAPHIC TAB */}
            {activeTab === 'pledge_info' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-[#111111] border border-neutral-800 rounded-2xl p-6 flex flex-col gap-6"
                id="pledge-infographic-section"
              >
                <div className="border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <ShieldCheck className="w-5 h-5 text-amber-500" />
                    <h2 className="text-lg font-serif font-bold text-gray-100">초고강도 5,000만 원 보안 약관 안내</h2>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Ace Match는 오직 진지한 신랑님들께 최고의 신부 매칭 기회를 제공하기 위해, 사진/영상 외부 무단 유출에 대해 강력한 사법적 대응을 가집니다.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#161616] border border-neutral-800/80 p-4 rounded-xl">
                    <Smartphone className="w-5 h-5 text-amber-500 mb-2" />
                    <span className="font-sans font-semibold text-xs text-gray-200 block mb-1">1단계: 본인인증 필수</span>
                    <span className="text-[11px] text-gray-400 leading-relaxed">
                      이름과 통신사 본인 고유번호를 연동하여 기기와 개인 신원을 최초 1회 철저히 매핑합니다.
                    </span>
                  </div>

                  <div className="bg-[#161616] border border-neutral-800/80 p-4 rounded-xl">
                    <Eye className="w-5 h-5 text-amber-500 mb-2" />
                    <span className="font-sans font-semibold text-xs text-gray-200 block mb-1">2단계: 동적 워터마크 기술</span>
                    <span className="text-[11px] text-gray-400 leading-relaxed">
                      인증된 신랑님의 실명과 전화번호가 사진 위에 반영구적 대각선 격자로 각인되어 유출 시 1초 만에 검출됩니다.
                    </span>
                  </div>

                  <div className="bg-[#161616] border border-neutral-800/80 p-4 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-500 mb-2" />
                    <span className="font-sans font-semibold text-xs text-gray-200 block mb-1">3단계: 영구 차단 & 소송</span>
                    <span className="text-[11px] text-gray-400 leading-relaxed">
                      약관 동의 후 캡처/유출 적발 시 즉시 법률사무소와 연계되어 5,000만 원 압류 및 형사 고발 조치됩니다.
                    </span>
                  </div>
                </div>

                <div className="bg-[#0D0D0D] p-4 rounded-xl border border-neutral-800 max-h-[220px] overflow-y-auto">
                  <span className="text-[11px] font-mono font-bold text-amber-500/80 uppercase block mb-2">[동의 약관 원문 초안]</span>
                  <pre className="text-[10px] font-sans text-gray-400 leading-relaxed whitespace-pre-wrap">
                    {SECURITY_PLEDGE_TEXT}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* 3. BRIDE GALLERY TAB */}
            {activeTab === 'gallery' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-6"
                id="gallery-grid-section"
              >
                
                {/* 1단계 비로그인 전 가드 경고 화면 */}
                {!userState.isVerified && (
                  <div className="bg-[#111111] border border-dashed border-amber-500/30 rounded-2xl p-8 text-center" id="unverified-gallery-card">
                    <div className="flex justify-center mb-5">
                      <BronzeLockIcon size="large" />
                    </div>
                    <h3 className="text-lg font-serif font-bold text-gray-200 mb-1.5">철통 보안 갤러리 잠김 상태</h3>
                    <p className="text-gray-400 text-xs max-w-sm mx-auto mb-6 leading-relaxed">
                      본 갤러리는 고품격 신부들의 완벽한 사생활 보장을 위해 기획되었습니다. 본인인증 완료 전에는 어떠한 프로필 사진도 열람할 수 없습니다.
                    </p>
                    <button
                      onClick={handleStartAuth}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-sans text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
                      id="gallery-auth-trigger-btn"
                    >
                      실시간 본인인증 완료하기
                    </button>
                  </div>
                )}

                {/* 1단계 본인인증 및 일반회원 진입 상태 */}
                {userState.isVerified && (() => {
                  const filteredBridalCatalog = selectedGradeFilter === 'ALL'
                    ? bridalCatalog
                    : bridalCatalog.filter(b => b.grade === selectedGradeFilter);

                  const itemsPerPage = 20;
                  const totalPages = Math.ceil(filteredBridalCatalog.length / itemsPerPage) || 1;
                  const paginatedBridalCatalog = filteredBridalCatalog.slice(
                    (currentPage - 1) * itemsPerPage,
                    currentPage * itemsPerPage
                  );

                  return (
                    <div className="space-y-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-900 pb-5" id="gallery-header-row">
                        <div className="space-y-1">
                          <h2 className="text-xl font-serif font-black text-gray-100 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-amber-500" />
                            에이스매치 엄선 신부 프로필
                          </h2>
                          <p className="text-gray-500 text-[11px] mt-0.5">
                            보안 서약에 따라 화면의 모든 컨텐츠에는 {userState.name} 신랑님의 연락처 워터마크가 강제 각인되어 보호됩니다.
                          </p>
                        </div>

                        {/* Visible 1-Hour Countdown Timer Interface */}
                        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
                          {userState.timerActive ? (
                            <div className="flex items-center gap-2.5 bg-red-950/20 border border-red-500/40 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)] ring-1 ring-red-500/20">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                              <div className="flex flex-col">
                                <span className="text-[9px] text-red-400 font-sans font-bold tracking-wider uppercase">안심 전액 환불/취소 가능 시간</span>
                                <span className="text-sm font-mono font-black text-red-500 tracking-wider">
                                  {formatTime(userState.timerSeconds)} 남음
                                </span>
                              </div>
                            </div>
                          ) : userState.isTimerExpired ? (
                            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl">
                              <span className="w-2 h-2 rounded-full bg-neutral-600" />
                              <div className="flex flex-col">
                                <span className="text-[9px] text-gray-500 font-sans font-bold tracking-wider uppercase">취소 가능 시간 만료</span>
                                <span className="text-xs font-sans font-extrabold text-gray-400">
                                  환불 불가 (서비스 영구 고정 완료)
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2.5 bg-neutral-900/60 border border-neutral-800 px-4 py-2 rounded-xl">
                              <Clock className="w-4 h-4 text-gray-500 animate-pulse" />
                              <div className="flex flex-col">
                                <span className="text-[9px] text-gray-500 font-sans font-bold tracking-wider uppercase">안심 취소 타이머</span>
                                <span className="text-xs font-sans font-bold text-gray-400">
                                  멤버십 승인 즉시 1시간 카운트다운 시작
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Demo Time Travel Controls */}
                          {userState.timerActive && (
                            <div className="flex items-center gap-2 bg-[#161616] border border-neutral-800 px-3 py-2 rounded-xl shrink-0">
                              <span className="text-[10px] text-gray-400 font-sans">⏱️ 데모:</span>
                              <button
                                onClick={handleFastForwardTimer}
                                className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 font-semibold text-[10px] px-2 py-1 rounded-lg border border-amber-500/20 transition-all cursor-pointer"
                                id="demo-timer-fastforward"
                              >
                                1시간 경과
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sub-tabs Grade Filter Bar */}
                      <div className="flex flex-wrap items-center gap-2 bg-[#131313] p-1.5 rounded-xl border border-neutral-900/80 w-full xl:w-auto animate-fade-in" id="gallery-grade-filter-bar">
                        {(['ALL', 'BRONZE', 'SILVER', 'GOLD', 'VIP'] as const).map(g => {
                          const counts = {
                            ALL: bridalCatalog.length,
                            BRONZE: bridalCatalog.filter(b => b.grade === 'BRONZE').length,
                            SILVER: bridalCatalog.filter(b => b.grade === 'SILVER').length,
                            GOLD: bridalCatalog.filter(b => b.grade === 'GOLD').length,
                            VIP: bridalCatalog.filter(b => b.grade === 'VIP').length,
                          };
                          const isActive = selectedGradeFilter === g;
                          return (
                            <button
                              key={g}
                              onClick={() => {
                                setSelectedGradeFilter(g);
                                setCurrentPage(1);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isActive
                                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10 font-extrabold'
                                  : 'text-gray-400 hover:text-gray-200 hover:bg-neutral-850'
                              }`}
                            >
                              {g === 'ALL' ? '전체 등급' : `${g === 'BRONZE' ? '브론즈' : g === 'SILVER' ? '실버' : g === 'GOLD' ? '골드' : 'VIP'}`}
                              <span className={`text-[9px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-black/20 text-black' : 'bg-neutral-900 text-gray-500'}`}>
                                {counts[g]}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Interactive Demographic Target Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mt-1" id="gallery-demographic-cards">
                        {(['BRONZE', 'SILVER', 'GOLD', 'VIP'] as const).map(g => {
                          const isActive = selectedGradeFilter === g;
                          const isHighlighted = selectedGradeFilter === 'ALL' || isActive;
                          
                          const details = {
                            BRONZE: {
                              label: '브론즈',
                              desc: '국내거주재혼여성',
                              themeColor: 'border-amber-700/40 text-amber-500',
                              activeBg: 'bg-amber-950/20 border-amber-500 text-amber-300'
                            },
                            SILVER: {
                              label: '실버',
                              desc: '국내거주재혼 + 베트남현지거주 재혼',
                              themeColor: 'border-slate-700/40 text-slate-300',
                              activeBg: 'bg-slate-900/40 border-slate-400 text-slate-200'
                            },
                            GOLD: {
                              label: '골드',
                              desc: '현지거주초혼',
                              themeColor: 'border-yellow-600/40 text-yellow-500',
                              activeBg: 'bg-gradient-to-br from-[#241c0a] via-[#1a1407] to-neutral-900 border-yellow-500/80 text-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.15)] ring-1 ring-yellow-500/40'
                            },
                            VIP: {
                              label: 'VIP',
                              desc: '국내유학생 + 현지vip초혼',
                              themeColor: 'border-purple-700/40 text-purple-400',
                              activeBg: 'bg-gradient-to-br from-[#1e0f30] via-[#12071f] to-neutral-900 border-purple-500/80 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)] ring-1 ring-purple-500/40'
                            }
                          }[g];

                          return (
                            <button
                              key={g}
                              onClick={() => {
                                setSelectedGradeFilter(g);
                                setCurrentPage(1);
                              }}
                              className={`text-left p-3 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                                isActive
                                  ? `${details.activeBg} scale-[1.03]`
                                  : isHighlighted
                                    ? g === 'GOLD'
                                      ? 'bg-[#15120a] border-yellow-900/40 hover:border-yellow-700/60'
                                      : g === 'VIP'
                                        ? 'bg-[#110c18] border-purple-900/40 hover:border-purple-700/60'
                                        : 'bg-[#141414] border-neutral-800/80 hover:border-neutral-700'
                                    : 'bg-[#0f0f0f]/60 border-neutral-900/50 opacity-35 hover:opacity-50'
                              }`}
                            >
                              {/* Glowing gold subtle background effect for GOLD when active */}
                              {g === 'GOLD' && isActive && (
                                <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-yellow-500/10 rounded-full blur-xl pointer-events-none" />
                              )}
                              
                              <div className="flex items-center justify-between w-full mb-1">
                                <span className={`text-[10px] font-sans font-bold uppercase tracking-wider flex items-center gap-1 ${
                                  isActive 
                                    ? g === 'GOLD' 
                                      ? 'text-yellow-400' 
                                      : g === 'VIP' 
                                        ? 'text-purple-400' 
                                        : 'text-amber-400' 
                                    : 'text-gray-500'
                                }`}>
                                  {g === 'GOLD' && '✨ '}
                                  {g === 'VIP' && '👑 '}
                                  {details.label} 등급 대상
                                </span>
                                {isActive && (
                                  <span className="relative flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                      g === 'GOLD' ? 'bg-yellow-400' : g === 'VIP' ? 'bg-purple-400' : 'bg-amber-400'
                                    }`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${
                                      g === 'GOLD' ? 'bg-yellow-500' : g === 'VIP' ? 'bg-purple-500' : 'bg-amber-500'
                                    }`}></span>
                                  </span>
                                )}
                              </div>
                              <span className={`text-xs font-sans font-extrabold ${isActive ? 'text-gray-100' : 'text-gray-300'}`}>
                                {details.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Main gallery content grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3.5" id="gallery-grid-inner">
                                {paginatedBridalCatalog.map(bride => {
                                  const isAuthorized = checkTierAuthorization(bride.grade);
                                  
                                  return (
                                    <div 
                                      key={bride.id}
                                      className={`bg-[#111111] border rounded-xl overflow-hidden transition-all flex flex-col justify-between relative ${
                                        bride.isMarried
                                          ? 'border-emerald-500/20 shadow-lg shadow-emerald-950/10'
                                          : isAuthorized 
                                            ? 'border-neutral-800/80 hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/2' 
                                            : 'border-[#1A1A1A] opacity-80'
                                      }`}
                                      id={`bride-card-${bride.id}`}
                                    >
                                      {/* Profile Image Wrap */}
                                      <div className="relative aspect-[3/4] bg-[#0E0E0E] overflow-hidden">
                                        {isAuthorized ? (
                                          <>
                                            <img 
                                              src={bride.avatarUrl} 
                                              alt={bride.name}
                                              className={`w-full h-full object-cover select-none pointer-events-none ${bride.isMarried ? 'blur-[1px] saturate-[0.8]' : ''}`}
                                              referrerPolicy="no-referrer"
                                              onContextMenu={(e) => e.preventDefault()}
                                            />
                                            {/* Step 4: Dynamic Watermark Overlay */}
                                            <SecurityWatermark userName={userState.name} userPhone={userState.phone} />
                                          </>
                                        ) : (
                                          <>
                                            {/* Locked mosaic blurred bride image behind the screen */}
                                            <img 
                                              src={bride.avatarUrl} 
                                              alt={bride.name}
                                              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none blur-[14px] saturate-[1.1] scale-105 opacity-50"
                                              referrerPolicy="no-referrer"
                                              onContextMenu={(e) => e.preventDefault()}
                                            />
                                            {/* Custom pixel grid mosaic overlay texture */}
                                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.7)_2px,transparent_2px),linear-gradient(90deg,rgba(0,0,0,0.7)_2px,transparent_2px)] bg-[size:8px_8px] opacity-30 z-10 pointer-events-none" />
                                            
                                            {/* Lock text and controls on top */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-3 text-center select-none z-20">
                                              <div className="mb-2">
                                                <BronzeLockIcon size="small" />
                                              </div>
                                              <span className="bg-amber-950/50 text-amber-400 border border-amber-900/30 text-[8px] font-bold px-1.5 py-0.2 rounded mb-1.5 uppercase tracking-wide">
                                                {bride.grade === 'BRONZE' ? '브론즈' : bride.grade === 'SILVER' ? '실버' : bride.grade === 'GOLD' ? '골드' : 'VIP'} 잠김
                                              </span>
                                              <h4 className="text-[11px] font-sans font-bold text-gray-300">프로필 보기 차단</h4>
                                              <p className="text-[9px] text-gray-500 max-w-[130px] mt-0.5 leading-normal">
                                                이 신부는 **{bride.grade} 이상**의 등급만 조회 가능합니다.
                                              </p>
                                              <button
                                                onClick={() => {
                                                  alert(`자동 튕김 기믹 발동: 신부 갤러리 상세 조회를 누르면 등급 권한 미달로 인해 멤버십 요금표 페이지로 이동합니다.`);
                                                  setActiveTab('membership');
                                                }}
                                                className="mt-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] text-gray-300 text-[9px] font-sans px-2.5 py-1 rounded transition-colors flex items-center gap-0.5 cursor-pointer"
                                                id={`lock-redirect-btn-${bride.id}`}
                                              >
                                                멤버십 등급 업
                                                <ChevronRight className="w-3 h-3" />
                                              </button>
                                            </div>
                                          </>
                                        )}

                                        {/* Married Overlays */}
                                        {bride.isMarried && (
                                          <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[1.5px] flex items-center justify-center z-20">
                                            <div className="bg-[#0b1c14]/95 border border-emerald-500/40 rounded-xl px-3 py-2 text-center shadow-2xl max-w-[85%] scale-[1.02]">
                                              <span className="text-sm block mb-0.5">💍</span>
                                              <span className="text-[10px] font-sans font-black text-emerald-400 tracking-wider block">성혼 커플 탄생</span>
                                              <span className="text-[8px] text-gray-300 block leading-normal mt-0.5 font-medium">아름다운 동반자를 찾으셨습니다</span>
                                            </div>
                                          </div>
                                        )}

                                        {/* Live Badges Column */}
                                        <div className="absolute top-2 left-2 z-30 flex flex-col gap-1">
                                          {bride.isMarried && (
                                            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[8px] font-sans font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow border border-emerald-400/20">
                                              성혼 완료 💕
                                            </span>
                                          )}
                                          {bride.isMeetingWithOther && !bride.isMarried && (
                                            <span className="bg-rose-500/95 backdrop-blur-md text-white text-[8px] font-sans font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow border border-rose-400/20 animate-pulse">
                                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                                              미팅 진행중 ⏳
                                            </span>
                                          )}
                                          {bride.isNewFace && !bride.isMarried && (
                                            <span className="bg-blue-500/95 backdrop-blur-md text-white text-[8px] font-sans font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow border border-blue-400/20">
                                              NEW 🌿 뉴페이스
                                            </span>
                                          )}
                                        </div>

                                        {/* Grade Label Top Edge */}
                                        {isAuthorized && (
                                          <span className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md text-amber-400 text-[8px] font-sans font-bold px-1.5 py-0.5 rounded border border-amber-500/20 z-30 tracking-wider">
                                            {bride.grade}
                                          </span>
                                        )}
                                      </div>

                                      {/* Details Text - Slimmed paddings & sizes for 1/4th grid cards */}
                                      <div className="p-3.5 flex-1 flex flex-col justify-between gap-2.5 bg-[#121212]/30">
                                        <div>
                                          <div className="flex items-center justify-between mb-1.5">
                                            <h3 className="font-serif font-bold text-xs text-gray-200 truncate pr-1">
                                              {bride.isMarried
                                                ? (isAuthorized ? bride.name.split(' (')[0] : '성혼 완료 신부')
                                                : isAuthorized ? bride.name.split(' (')[0] : '비공개 신부 프로필'}
                                            </h3>
                                            <span className="text-[9px] text-gray-500 font-sans font-medium shrink-0">
                                              {bride.location.split(' ')[0]}
                                            </span>
                                          </div>

                                          <div className="flex items-center gap-1 mb-2 text-[10px] font-mono text-gray-400">
                                            <span>{bride.age}세</span>
                                            <span className="text-gray-600">•</span>
                                            <span>{bride.height}cm</span>
                                            <span className="text-gray-600">•</span>
                                            <span>{bride.weight}kg</span>
                                          </div>

                                          <p className="text-[10.5px] text-gray-400 leading-normal line-clamp-2 min-h-[32px]">
                                            {bride.isMarried
                                              ? '에이스매치 정회원님과 성혼 매칭이 완료되어 가정을 꾸린 영광의 대표 사례입니다.'
                                              : isAuthorized ? bride.shortBio : '등급 업그레이드 후 베스트 컷 얼굴 사진, 신체 사이즈 및 상세 소개글을 열람해 보세요.'}
                                          </p>

                                          {/* Status subtext */}
                                          {bride.isMeetingWithOther && !bride.isMarried && isAuthorized && (
                                            <p className="text-[9px] text-rose-400/90 font-sans font-semibold mt-1.5 flex items-center gap-1">
                                              <span>⚠️ 현재 타 회원과 교제 중 (대기 매칭 가능)</span>
                                            </p>
                                          )}
                                        </div>

                                        {/* Trigger Step 5 */}
                                        <button
                                          onClick={() => handleRequestMeeting(bride)}
                                          className={`w-full font-sans text-[10px] font-bold py-1.5 px-2.5 rounded-lg flex items-center justify-center gap-1 transition-all ${
                                            bride.isMarried
                                              ? 'bg-emerald-950/20 text-emerald-500/60 border border-emerald-900/30 cursor-not-allowed'
                                              : isAuthorized
                                                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/10'
                                                : 'bg-[#181818] text-gray-500 cursor-not-allowed border border-neutral-900 text-[9px]'
                                          }`}
                                          id={`meeting-req-btn-${bride.id}`}
                                          disabled={bride.isMarried}
                                        >
                                          {bride.isMarried ? (
                                            <>
                                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                              성혼 매칭 성공
                                            </>
                                          ) : userState.meetingRequestedBrideId === bride.id && userState.contractStatus === 'COMPLETED' ? (
                                            <>
                                              <Unlock className="w-3 h-3" />
                                              열람완료
                                            </>
                                          ) : (
                                            <>
                                              <Check className="w-3 h-3" />
                                              {isAuthorized 
                                                ? (bride.isMeetingWithOther ? '미팅 대기 신청하기' : '미팅 신청하기') 
                                                : `${bride.grade} 전용`}
                                            </>
                                          )}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>

                      {/* Pagination Controls bar */}
                      {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#1E1E1E] pt-5 mt-4" id="gallery-pagination-container">
                          <span className="text-xs text-gray-500 font-sans">
                            총 <strong className="text-amber-500/90">{filteredBridalCatalog.length}</strong>명 중 <strong>{((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredBridalCatalog.length)}</strong>명 표시 중
                          </span>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setCurrentPage(prev => Math.max(prev - 1, 1));
                                document.getElementById('gallery-grid-section')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              disabled={currentPage === 1}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] text-gray-400 hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-900/80 text-[11px] font-bold transition-all cursor-pointer"
                              id="page-prev-btn"
                            >
                              이전
                            </button>

                            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(pageNum => {
                              const isCurrent = currentPage === pageNum;
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => {
                                    setCurrentPage(pageNum);
                                    document.getElementById('gallery-grid-section')?.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className={`w-7 h-7 rounded-lg text-xs font-sans font-bold transition-all cursor-pointer ${
                                    isCurrent
                                      ? 'bg-amber-500 text-black shadow-md shadow-amber-500/10 font-extrabold'
                                      : 'bg-[#141414] hover:bg-[#1E1E1E] text-gray-400 hover:text-gray-200 border border-neutral-900/80'
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            })}

                            <button
                              onClick={() => {
                                  setCurrentPage(prev => Math.min(prev + 1, totalPages));
                                  document.getElementById('gallery-grid-section')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              disabled={currentPage === totalPages}
                              className="px-2.5 py-1.5 rounded-lg bg-[#141414] hover:bg-[#1E1E1E] text-gray-400 hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed border border-neutral-900/80 text-[11px] font-bold transition-all cursor-pointer"
                              id="page-next-btn"
                            >
                              다음
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

              </motion.div>
            )}

          </AnimatePresence>

          {/* ----------------- STEP 5 UNLOCKED HIDDEN DETAIL VIEW ----------------- */}
          {userState.isVerified && selectedBride && checkTierAuthorization(selectedBride.grade) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#111111] border border-amber-500/30 rounded-2xl p-6 mt-6 shadow-xl"
              id="bride-detail-profile-sheet"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-neutral-800 pb-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-amber-500/10 text-amber-400 text-[10px] font-sans font-bold px-2 py-0.5 rounded border border-amber-500/20">
                      ACTIVE BRIDE DETAIL
                    </span>
                    <span className="text-xs text-gray-500 font-mono">ID: {selectedBride.id}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-100 mt-1">{selectedBride.name} 상세 프로필</h3>
                </div>

                <button
                  onClick={() => setSelectedBride(null)}
                  className="text-gray-400 hover:text-gray-200 text-xs font-sans font-semibold px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 transition-all"
                  id="close-detail-btn"
                >
                  상세 닫기
                </button>
              </div>

              {/* Sub Grid Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative aspect-square rounded-xl overflow-hidden bg-black mb-3">
                    <img 
                      src={selectedBride.avatarUrl} 
                      alt={selectedBride.name} 
                      className="w-full h-full object-cover select-none pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    <SecurityWatermark userName={userState.name} userPhone={userState.phone} />
                  </div>
                  <span className="text-[11px] text-gray-500 block text-center leading-relaxed">
                    🚨 상시 작동 워터마크: 유출 시 {userState.name} 신랑님 수사 의뢰 및 손해 배상이 착수됩니다.
                  </span>
                </div>

                <div className="flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="bg-[#161616] rounded-xl p-4 border border-neutral-900">
                      <h4 className="text-xs text-amber-500 font-sans font-semibold mb-2">핵심 인적 사항</h4>
                      <table className="w-full text-xs font-sans text-gray-300 leading-relaxed">
                        <tbody>
                          <tr className="border-b border-neutral-800/50">
                            <td className="py-2 text-gray-500 font-medium">나이 / 지역</td>
                            <td className="py-2 text-gray-200">{selectedBride.age}세 / {selectedBride.location}</td>
                          </tr>
                          <tr className="border-b border-neutral-800/50">
                            <td className="py-2 text-gray-500 font-medium">신체 사이즈</td>
                            <td className="py-2 text-gray-200">{selectedBride.height}cm / {selectedBride.weight}kg</td>
                          </tr>
                          <tr className="border-b border-neutral-800/50">
                            <td className="py-2 text-gray-500 font-medium">취미 / 학력</td>
                            <td className="py-2 text-gray-200">한국 가요 감상, 한식 요리 / 전문 학사</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-gray-500 font-medium">성격 및 연애관</td>
                            <td className="py-2 text-gray-200">차분하고 한 사람만 평생 믿어주는 가치관</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      "평생 서로를 보듬어 줄 수 있는 진솔한 한국 신랑님을 맞이하고 싶습니다. 믿어주시는 만큼 저도 한국어 공부와 주부 습득을 완벽하게 준비하여 귀국하겠습니다."
                    </p>
                  </div>

                  {/* STEP 5: SignOK Status Action Info Bar */}
                  {userState.contractStatus === 'NONE' && (
                    <button
                      onClick={() => handleRequestMeeting(selectedBride)}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-sans text-xs font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                      id="contract-start-action-btn"
                    >
                      <FileText className="w-4 h-4" />
                      500만 원 성혼 계약 체결 (SignOK 발행)
                    </button>
                  )}

                  {userState.contractStatus === 'SIGNED' && (
                    <div className="bg-blue-950/30 border border-blue-900 rounded-xl p-4 text-center">
                      <span className="text-[10px] bg-blue-900 text-blue-300 font-bold px-2 py-0.5 rounded-full uppercase block w-fit mx-auto mb-1 animate-pulse">
                        SignOK 체결 및 계약금 예치완료
                      </span>
                      <h4 className="text-xs font-sans font-bold text-gray-200">관리자(사장님) 승인 대기 중</h4>
                      <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                        우측 <strong>구글 시트 실시간 자동화 모니터</strong> 우측 상단의 <strong className="text-amber-400">[사장님 승인: [계약완료] 변경]</strong> 버튼을 마우스로 클릭하여 최종 입금 승인 단계를 가상 처리해 보세요!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ----------------- STEP 5 UNLOCKED HIDDEN CHANNELS (LOCK / UNLOCK) ----------------- */}
              <div className="border-t border-neutral-800 pt-6 mt-6" id="hidden-profile-dock">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {userState.contractStatus === 'COMPLETED' ? (
                      <Unlock className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Lock className="w-5 h-5 text-amber-500" />
                    )}
                    <div>
                      <h4 className="font-serif font-bold text-sm text-gray-200">
                        {selectedBride.name}의 히든 스페셜 프로필 전면 잠금해제
                      </h4>
                      <p className="text-[10px] text-gray-500">
                        500만 원 성혼계약 서명 날인 및 잔금 처리가 시트에서 [계약완료] 상태로 변경되면 자동으로 완전 오픈됩니다.
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded ${
                    userState.contractStatus === 'COMPLETED' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' 
                      : 'bg-neutral-900 text-gray-500'
                  }`}>
                    {userState.contractStatus === 'COMPLETED' ? 'UNLOCKED (잠금해제)' : 'LOCKED (잠김)'}
                  </span>
                </div>

                {userState.contractStatus !== 'COMPLETED' ? (
                  // LOCKED DOCK MOCK
                  <div className="bg-[#0B0B0B] border border-[#222222] rounded-xl p-8 text-center relative overflow-hidden flex flex-col items-center justify-center">
                    <LockKeyhole className="w-8 h-8 text-neutral-700 mb-3" />
                    <h5 className="text-xs font-sans font-bold text-gray-400">철벽 히든 프로필 잠김 상태</h5>
                    <p className="text-[11px] text-gray-500 max-w-sm mt-1 leading-relaxed">
                      "일상 사진 10장 더 보기", "잘로 영상 통화", "공식 건강/사법 신원 검증서" 등의 실제 서류들은 500만 원 성혼 서명 계약금 확인 후 해제됩니다.
                    </p>
                  </div>
                ) : (
                  // UNLOCKED DOCK CONTENT (Step 5 Unlock Actions)
                  <div className="bg-[#141414] border border-emerald-900/30 rounded-xl p-4 flex flex-col gap-4">
                    
                    {/* Action 1: Interactive Daily Photos 10 more */}
                    <div className="bg-[#1A1A1A] rounded-xl p-3 border border-neutral-800">
                      <span className="text-[10px] text-emerald-400 font-sans font-bold block mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        [기능 1] 일상 및 소통 사진 10장 더 보기
                      </span>
                      <div className="grid grid-cols-5 gap-2">
                        {selectedBride.hiddenPhotos.map((photo, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setActiveHiddenPhotoIndex(idx)}
                            className="aspect-square bg-black rounded-lg overflow-hidden border border-neutral-800 hover:border-emerald-500 cursor-pointer transition-all relative group"
                          >
                            <img 
                              src={photo} 
                              alt={`hidden ${idx}`} 
                              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all flex items-center justify-center">
                              <Eye className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <SecurityWatermark userName={userState.name} userPhone={userState.phone} />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Action 2: Zalo Video Stream mock */}
                      <div className="bg-[#1A1A1A] rounded-xl p-3 border border-neutral-800 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-emerald-400 font-sans font-bold block mb-1 flex items-center gap-1.5">
                            <Play className="w-3.5 h-3.5" />
                            [기능 2] 잘로(Zalo) 미공개 셀프 고백 영상
                          </span>
                          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                            신부님이 신랑님 한 분만을 지목해 서툰 한국어로 촬영한 친근한 셀프 영상 편지입니다.
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveVideoUrl(selectedBride.zaloVideoUrl)}
                          className="w-full bg-[#202020] hover:bg-[#2A2A2A] text-emerald-400 text-xs font-sans font-semibold py-2 px-3 rounded-lg border border-emerald-900/30 flex items-center justify-center gap-1.5 transition-colors"
                          id="play-zalo-video-btn"
                        >
                          <Play className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                          잘로 영상 즉시 재생하기
                        </button>
                      </div>

                      {/* Action 3: Document Verification downloads */}
                      <div className="bg-[#1A1A1A] rounded-xl p-3 border border-neutral-800 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] text-emerald-400 font-sans font-bold block mb-1 flex items-center gap-1.5">
                            <Download className="w-3.5 h-3.5" />
                            [기능 3] 공식 사법 / 건강 검증 서류 다운로드
                          </span>
                          <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
                            사법 1등급 공증서, 정신건강 진단서, 매독/HIV 음성 판정서가 포함된 공식 외교보증 신원 조회 패키지입니다.
                          </p>
                        </div>
                        <button
                          onClick={() => setShowDocModal(true)}
                          className="w-full bg-[#202020] hover:bg-[#2A2A2A] text-emerald-400 text-xs font-sans font-semibold py-2 px-3 rounded-lg border border-emerald-900/30 flex items-center justify-center gap-1.5 transition-colors"
                          id="view-doc-bundle-btn"
                        >
                          <Download className="w-3.5 h-3.5" />
                          검증 서류 일체 다운로드 및 열람
                        </button>
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </motion.div>
          )}

        </section>

        {/* Right Section: Real-time Google Sheets Simulator / Admin Panel (30% on desktop) */}
        <section className="w-full lg:w-[420px] flex-shrink-0 flex flex-col gap-6" id="simulator-monitor-rail">
          
          {/* Quick Scenario Guide Panel */}
          <div className="bg-[#111111] border border-neutral-800 rounded-xl p-5 shadow-lg">
            <h3 className="font-serif font-bold text-sm text-amber-500 tracking-wide mb-3 flex items-center gap-1.5 uppercase">
              <Sparkles className="w-4 h-4" />
              자동화 시나리오 퀵 테스트 가이드
            </h3>
            
            <ol className="text-xs font-sans text-gray-400 space-y-3 leading-relaxed list-decimal list-inside">
              <li>
                <strong className="text-gray-200">1단계 보안서약:</strong> 상단의 <span className="text-amber-500 font-medium">`휴대폰 본인인증`</span>을 클릭해 이름과 번호를 입력한 뒤 5,000만원 법적유출배상 서약서에 사인을 완료하세요.
              </li>
              <li>
                <strong className="text-gray-200">2단계 등급결제:</strong> 가입 후 신부를 클릭하면 멤버십 요금표로 튕겨 나갑니다. 요금표에서 결제를 진행하면 구글 시트에 실시간 자동 기록되며 갤러리가 열립니다.
              </li>
              <li>
                <strong className="text-gray-200">3단계 타이머 (Case A/B):</strong> 결제 후 상단의 실시간 타이머를 관찰하세요. <span className="text-red-400 font-medium">`환불`</span>을 누르면 <strong>영구제명 후 블랙리스트 시트</strong>로 즉시 복사 이동됩니다. <span className="text-amber-400 font-medium">`1시간 경과`</span>를 누르면 환불이 차단됩니다.
              </li>
              <li>
                <strong className="text-gray-200">4단계 워터마크:</strong> 활성화된 신부 이미지를 열면 본인의 이름/번호가 각인된 대각선 실시간 흐릿한 워터마크가 노출됩니다.
              </li>
              <li>
                <strong className="text-gray-200">5단계 미팅/잠금해제:</strong> 미팅 신청을 누른 후 SignOK 전자서명을 완료하고, 시트의 <span className="text-amber-400 font-medium">`사장님 승인`</span> 버튼을 누르면 자물쇠로 잠겨있던 히든 3대 파일이 활성화됩니다!
              </li>
            </ol>
          </div>

          {/* Real-time Spreadsheet Panel View */}
          <GroomSheetView
            userState={userState}
            sheetRows={sheetRows}
            blacklistRows={blacklistRows}
            onSetContractCompleted={handleSetContractCompleted}
            onResetSimulation={handleResetSimulation}
          />

        </section>

      </main>

      {/* ----------------- MODALS INTERFACE ----------------- */}

      {/* MODAL 1: Phone Verification Mobile Simulator (1단계) */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="phone-auth-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] border border-neutral-800 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-amber-500"></div>
              
              <div className="p-6 border-b border-neutral-800 text-center">
                <Smartphone className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                <h3 className="text-lg font-serif font-bold text-gray-100">휴대폰 본인 명의 인증</h3>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                  유출 피해 보상 추적을 위해 명의 일치 조회를 실시합니다. 반드시 본인의 실명과 연락처를 입력해 주세요.
                </p>
              </div>

              <form onSubmit={handleVerifySubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">신랑 실명</label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="홍길동"
                    className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-gray-200 font-sans focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-sans font-bold text-gray-400 mb-1.5 uppercase tracking-wider">휴대폰 연락처</label>
                  <input
                    type="tel"
                    required
                    value={authForm.phone}
                    onChange={(e) => setAuthForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="010-5678-1234"
                    className="w-full bg-[#161616] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-gray-200 font-sans focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                <div className="bg-[#181818] rounded-lg p-3 text-[10px] text-amber-400 border border-amber-500/10 leading-relaxed flex gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>인증 시, 기기 고유 접속 식별자(IP/디바이스 정보)가 암호화 세션에 등록되어 이미지 유출 추적 추적기로 자동 변환됩니다.</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAuthModal(false)}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-gray-400 font-sans text-xs font-semibold py-2.5 rounded-xl border border-neutral-800 transition-colors"
                    id="close-auth-modal"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-sans text-xs font-bold py-2.5 rounded-xl shadow-lg transition-colors"
                    id="submit-auth-modal"
                  >
                    인증 코드 전송
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: 50M KRW Leak security pledge (1단계) */}
      <AnimatePresence>
        {showPledgeModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4" id="security-pledge-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] border border-neutral-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-red-600"></div>
              
              <div className="p-6 border-b border-neutral-800">
                <div className="flex items-center gap-2 text-red-500">
                  <ShieldCheck className="w-5 h-5 text-red-500 animate-pulse" />
                  <span className="text-xs font-sans font-bold tracking-widest uppercase">극비 안심 정보 취급 서약</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-100 mt-1">
                  5,000만 원 유출 배상 및 형사고발 동의 서약서
                </h3>
              </div>

              <div className="p-6 max-h-[350px] overflow-y-auto bg-[#0A0A0A] border-b border-neutral-800 text-[11px] font-sans text-gray-400 leading-relaxed space-y-4">
                <div className="bg-red-950/20 text-red-400 border border-red-900/30 rounded-lg p-3 text-[10px] mb-3">
                  ⚠️ <strong>실시간 워터마크 기술 탑재 고지:</strong> 서명 동의 즉시, 갤러리 내 모든 초고화질 사진에 신랑님의 이름(<strong className="text-white">{authForm.name}</strong>) 및 연락처(<strong className="text-white">{authForm.phone}</strong>)가 diagonal(대각선) 동적 워터마크로 투영 각인됩니다. 캡처나 무단 전재 적발 시 타임스탬프를 통한 법적 소송이 개시됩니다.
                </div>
                <pre className="whitespace-pre-wrap font-sans text-gray-300 leading-relaxed text-xs">
                  {SECURITY_PLEDGE_TEXT}
                </pre>
              </div>

              <div className="p-6 bg-[#111111] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-gray-500">서명 서약인:</span>
                  <span className="text-xs font-sans font-bold text-amber-500 underline underline-offset-4 decoration-amber-500/50">
                    {authForm.name} ({authForm.phone})
                  </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      alert('서약 비동의 시 회원가입 및 프로필 열람이 불가능합니다.');
                      setShowPledgeModal(false);
                    }}
                    className="flex-1 sm:flex-initial bg-neutral-900 hover:bg-neutral-800 text-gray-400 font-sans text-xs font-semibold py-2 px-4 rounded-xl border border-neutral-800 transition-colors"
                    id="reject-pledge-btn"
                  >
                    동의 안 함
                  </button>
                  <button
                    onClick={handlePledgeAgree}
                    className="flex-1 sm:flex-initial bg-red-600 hover:bg-red-500 text-white font-sans text-xs font-bold py-2 px-5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1"
                    id="agree-and-sign-pledge-btn"
                  >
                    동의 및 서약서 서명 완료
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 3: Refund Warning (Step 3 Case A) */}
      <AnimatePresence>
        {showRefundWarningModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4" id="refund-warning-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] border border-red-950 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-1.5 bg-red-600 animate-pulse"></div>
              
              <div className="p-6 text-center border-b border-red-950/40">
                <div className="w-12 h-12 rounded-full bg-red-950/60 text-red-500 border border-red-800 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-serif font-bold text-red-500">영구 제명 최종 차단 경고</h3>
                <p className="text-xs text-gray-300 mt-2 font-sans font-semibold leading-relaxed">
                  "즉시 영구제명되며 재가입이 불가능합니다."
                </p>
              </div>

              <div className="p-5 text-xs text-gray-400 font-sans leading-relaxed space-y-3 bg-[#0A0A0A]">
                <p>
                  가입 및 결제 후 <strong>1시간 이내 환불 신청</strong>을 접수하시는 경우, 결제금액은 즉시 전액 환불처리됩니다.
                </p>
                <p className="text-red-400 font-bold">
                  단, 환불 승인 완료 즉시 구글 스프레드시트의 등급 상태가 [BLACK]으로 강제 변환 세팅되며, 신원과 휴대폰 번호가 영구 차단 블랙리스트 시트로 이관 복사됩니다.
                </p>
                <p className="text-amber-500">
                  이후 동일 명의, 기기, 연락처로는 평생 에이스 매치 신규 가입 및 접속 자체가 철저히 거절됩니다. 정말 환불을 요청하시겠습니까?
                </p>
              </div>

              <div className="p-6 bg-[#111111] border-t border-red-950/30 flex gap-3">
                <button
                  onClick={() => setShowRefundWarningModal(false)}
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#252525] text-gray-300 text-xs font-sans font-semibold py-2.5 rounded-xl border border-neutral-800 transition-all"
                  id="cancel-refund-btn"
                >
                  아니오, 계속 유지하기
                </button>
                <button
                  onClick={handleConfirmRefund}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-sans font-bold py-2.5 rounded-xl transition-all"
                  id="confirm-refund-ban-btn"
                >
                  네, 영구 제명 및 환불
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4: SignOK Smart Electronic Contract (Step 5) */}
      <AnimatePresence>
        {showSignOkModal && selectedBride && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="signok-contract-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] border border-neutral-800 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="bg-[#002B49] text-white px-5 py-4 flex items-center justify-between border-b border-blue-900">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                  <span className="font-sans text-xs font-extrabold tracking-widest text-[#00E5FF]">SignOK Electronic Contract System</span>
                </div>
                <span className="bg-[#003d66] text-blue-200 text-[9px] px-2 py-0.5 rounded font-mono font-bold border border-blue-800">보안 1등급 채널</span>
              </div>

              <div className="p-6">
                <div className="border-b border-neutral-800 pb-3 mb-4">
                  <h3 className="text-base font-serif font-bold text-gray-100 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    [공인 성혼 매칭] 500만 원 성혼 계약서 발행
                  </h3>
                  <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                    본 채널은 신랑님과 선택한 신부({selectedBride.name}) 간의 법적 미팅 전제 및 미결성 성혼 성사를 위한 가상 보증 계약입니다.
                  </p>
                </div>

                <div className="bg-[#0A0A0A] rounded-xl border border-neutral-800 p-4 max-h-[220px] overflow-y-auto mb-4 text-[11px] font-sans text-gray-400 leading-relaxed space-y-2">
                  <pre className="whitespace-pre-wrap leading-relaxed text-xs text-gray-300">
                    {SIGN_OK_CONTRACT_TEMPLATE}
                  </pre>
                </div>

                <div className="bg-cyan-950/20 border border-cyan-900/30 rounded-xl p-3 mb-4 text-[10px] text-cyan-400 leading-relaxed">
                  ✍️ <strong>전자인증 날인 약정:</strong> 서명을 완료하고 '가상 150만 원 계약금 입금 완료'를 클릭하면, 구글 스프레드시트의 계약 상태가 [SIGNED]로 전환되며 사장님의 실시간 최종 시트 변경 후 히든 프로필 잠금이 완전 해제됩니다.
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSignOkModal(false)}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-gray-400 font-sans text-xs font-semibold py-2.5 rounded-xl border border-neutral-800 transition-colors"
                    id="close-signok-modal"
                  >
                    계약 보류
                  </button>
                  <button
                    onClick={handleSignOkComplete}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-sans text-xs font-bold py-2.5 rounded-xl shadow-lg shadow-blue-900/10 transition-all flex items-center justify-center gap-1.5"
                    id="confirm-signok-sign-btn"
                  >
                    공인 서명 및 입금 예약 완료
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 4.5: Account Transfer (Bank Transfer) Modal */}
      <AnimatePresence>
        {showAccountPaymentModal && pendingPaymentGrade && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="account-payment-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] border border-neutral-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="bg-[#1e1a0f] border-b border-yellow-900/30 px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="font-sans text-xs font-black tracking-widest text-yellow-500">PREMIUM BANK TRANSFER</span>
                </div>
                <span className="bg-[#241c0a] text-yellow-400 text-[9px] px-2 py-0.5 rounded font-sans font-bold border border-yellow-800/40">실시간 자동 입금 확인</span>
              </div>

              <div className="p-6">
                <div className="border-b border-neutral-800/50 pb-3 mb-4 text-center">
                  <h3 className="text-base font-sans font-bold text-gray-100 mb-1">
                    무통장 계좌 이체 결제 안내
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    아래 계좌로 정액 이체해주시면 AI 시스템에서 실시간으로 대조 후 즉시 권한을 승인합니다.
                  </p>
                </div>

                {/* Grade and Amount Info Card */}
                {(() => {
                  const tier = MEMBERSHIP_TIERS.find(t => t.id === pendingPaymentGrade);
                  return (
                    <div className="bg-[#161616] border border-neutral-850 rounded-xl p-3.5 mb-4 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-gray-500 block">선택하신 등급</span>
                        <span className="font-sans font-black text-sm text-yellow-500">{tier?.name || pendingPaymentGrade} 등급 멤버십</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-500 block">이체하실 금액</span>
                        <span className="font-sans font-black text-base text-gray-100">{tier?.priceText}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Account Details Box */}
                <div className="bg-[#0A0A0A] border border-neutral-800 rounded-xl p-4 mb-4 relative overflow-hidden">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                      <span className="text-xs text-gray-500">입금 은행</span>
                      <span className="text-xs font-sans font-bold text-gray-200">NH농협은행</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-neutral-900 pb-2">
                      <span className="text-xs text-gray-500">계좌 번호</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-sans font-bold text-yellow-500 tracking-wider">351-7247-0293-33</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('351-7247-0293-33');
                            setCopiedText(true);
                            setTimeout(() => setCopiedText(false), 2000);
                          }}
                          className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-[10px] text-gray-400 font-sans px-1.5 py-0.5 rounded flex items-center gap-1 transition-all"
                        >
                          {copiedText ? '복사됨!' : '복사'}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">예금주</span>
                      <span className="text-xs font-sans font-bold text-gray-200">PHanthithutrang</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-950/10 border border-yellow-900/20 rounded-xl p-3 mb-5 text-[10px] text-yellow-600/90 leading-relaxed">
                  ⚠️ <strong>이체 시 주의사항:</strong> 송금인 이름은 현재 인증 받으신 신랑 회원명인 <strong>{userState.name || '본인 이름'}</strong>으로 송금해주셔야 시스템에서 즉시 자동 승인이 연동됩니다.
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAccountPaymentModal(false);
                      setPendingPaymentGrade(null);
                    }}
                    className="flex-1 bg-neutral-900 hover:bg-neutral-800 text-gray-400 font-sans text-xs font-semibold py-3 rounded-xl border border-neutral-800 transition-colors"
                    id="cancel-payment-btn"
                  >
                    이체 취소
                  </button>
                  <button
                    onClick={handleConfirmAccountPayment}
                    className="flex-1 bg-gradient-to-r from-yellow-600 to-amber-500 hover:from-yellow-500 hover:to-amber-400 text-black font-sans text-xs font-bold py-3 rounded-xl shadow-lg shadow-yellow-950/20 transition-all flex items-center justify-center gap-1.5"
                    id="confirm-payment-transfer-btn"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    이체 완료 및 확인 요청
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 5: Zalo Video Mock Player popup (Step 5 Unlock Action 2) */}
      <AnimatePresence>
        {activeVideoUrl && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="zalo-video-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] border border-emerald-950 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>
              
              <div className="bg-[#181818] px-4 py-3 border-b border-neutral-800 flex justify-between items-center">
                <span className="text-xs text-emerald-400 font-sans font-bold flex items-center gap-1">
                  <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  잘로(Zalo) 전용 소통 라이브 영상 (Simulated)
                </span>
                <button 
                  onClick={() => setActiveVideoUrl(null)}
                  className="text-gray-500 hover:text-gray-300 text-xs font-bold"
                  id="close-zalo-modal"
                >
                  닫기
                </button>
              </div>

              <div className="relative aspect-[9/16] bg-black">
                <video
                  src={activeVideoUrl}
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
                
                {/* Overlaying Security Watermark even on active video stream to represent high security */}
                <SecurityWatermark userName={userState.name} userPhone={userState.phone} />
              </div>

              <div className="p-4 bg-[#111111] text-center text-[10px] text-gray-500 font-sans">
                ⚠️ 본 미팅 검증 영상은 무단 복제 및 화면 캡처 시 가입서약 위반으로 처벌 대상이 됩니다.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 6: Certified Health/Criminal Documents Downloader Popup (Step 5 Unlock Action 3) */}
      <AnimatePresence>
        {showDocModal && selectedBride && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4" id="official-docs-modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111111] border border-emerald-950 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-emerald-500"></div>
              
              <div className="bg-[#161616] px-5 py-4 border-b border-neutral-800 flex justify-between items-center">
                <span className="text-xs text-emerald-400 font-sans font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  {selectedBride.name} 공식 외교 신원 보증서 묶음
                </span>
                <button 
                  onClick={() => setShowDocModal(false)}
                  className="text-gray-500 hover:text-gray-300 text-xs font-bold"
                  id="close-official-docs"
                >
                  닫기
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="border border-dashed border-emerald-800/30 bg-emerald-950/10 rounded-xl p-4 flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-sans font-bold text-gray-200">대한민국 외교부 공인 3대 신원 보증 확인</h4>
                    <p className="text-[11px] text-gray-400 leading-relaxed mt-1">
                      하단의 서류는 해당 신부의 동의 하에 발급 및 번역 공증된 대한민국 대사관 제출용 원본 번역 확인서입니다.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#161616] border border-neutral-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-red-400" />
                      <div>
                        <span className="text-xs font-sans font-semibold text-gray-200 block">1. 베트남 사법 1등급 공증서 (범죄 경력 조회)</span>
                        <span className="text-[10px] text-gray-500">발급기관: 베트남 사법부 | 상태: 전과 무 (Clean)</span>
                      </div>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">VERIFIED</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#161616] border border-neutral-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="text-xs font-sans font-semibold text-gray-200 block">2. 외교부 공인 정신/건강 종합 진단 결과서</span>
                        <span className="text-[10px] text-gray-500">발급기관: 하노이 국립 병원 | 상태: 정신건강 정상, 매독/HIV 음성</span>
                      </div>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">PASSED</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-[#161616] border border-neutral-800">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-sans font-semibold text-gray-200 block">3. 현지 관할 동사무소 미혼 증명원 (독신 증명서)</span>
                        <span className="text-[10px] text-gray-500">발급기관: 하이퐁 동사무소 | 상태: 중혼 이력 없음</span>
                      </div>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-900 text-[9px] px-1.5 py-0.5 rounded font-mono font-bold">PASSED</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      alert('💾 대한민국 보증 제출용 PDF 서류가 디바이스에 정상 다운로드되었습니다.');
                      setShowDocModal(false);
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold py-2.5 rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-colors"
                    id="pdf-download-action-btn"
                  >
                    <Download className="w-4 h-4" />
                    외교부 인증 보증 서류 패키지 PDF 다운로드
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 7: Active Expanded Hidden Photo Slider */}
      <AnimatePresence>
        {activeHiddenPhotoIndex !== null && selectedBride && (
          <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4" id="photo-slider-modal">
            <div className="max-w-2xl w-full flex flex-col gap-3">
              <div className="flex justify-between items-center px-2">
                <span className="text-xs text-gray-400">
                  {selectedBride.name} 히든 스튜디오 컷 ({activeHiddenPhotoIndex + 1} / 10)
                </span>
                <button
                  onClick={() => setActiveHiddenPhotoIndex(null)}
                  className="bg-neutral-900 hover:bg-neutral-800 text-gray-300 text-xs px-3 py-1.5 rounded-lg border border-neutral-800 transition-all"
                  id="close-slider-btn"
                >
                  슬라이드 닫기
                </button>
              </div>

              <div className="relative aspect-square rounded-2xl overflow-hidden bg-black border border-neutral-800">
                <img 
                  src={selectedBride.hiddenPhotos[activeHiddenPhotoIndex]} 
                  alt="expanded hidden"
                  className="w-full h-full object-cover select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
                <SecurityWatermark userName={userState.name} userPhone={userState.phone} />
              </div>

              <div className="flex justify-center gap-1.5">
                {selectedBride.hiddenPhotos.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHiddenPhotoIndex(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-colors ${
                      activeHiddenPhotoIndex === idx ? 'bg-amber-500' : 'bg-neutral-800 hover:bg-neutral-700'
                    }`}
                    id={`dot-photo-${idx}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- FOOTER ----------------- */}
      <footer className="bg-[#090909] border-t border-[#181818] py-8 px-4 text-center">
        <p className="text-xs text-gray-600 font-sans leading-relaxed">
          본 플랫폼은 구글 빌더 및 자동화 트리거를 시각화하기 위해 특수 설계된 인터랙티브 목업 데모 애플리케이션입니다.<br />
          모든 인명, 단체 및 구글 시트 연동 시나리오는 안전한 브라우저 가상 샌드박스 내부에서 100% 리얼타임 시뮬레이션 작동합니다.
        </p>
        <p className="text-[10px] text-gray-700 mt-2 font-mono">
          © 2026 VOWS CO. ALL SECURITY SYSTEM RESERVED.
        </p>
      </footer>

    </div>
  );
}
