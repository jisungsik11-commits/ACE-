import { BrideProfile } from './types';

export const MEMBERSHIP_TIERS = [
  { id: 'BRONZE', name: '브론즈 멤버십', price: 100000, priceText: '10만 원', label: 'BRONZE', desc: '국내거주재혼여성 프로필 열람 가능' },
  { id: 'SILVER', name: '실버 멤버십', price: 200000, priceText: '20만 원', label: 'SILVER', desc: '국내거주재혼 + 현지거주재혼 프로필 열람 가능' },
  { id: 'GOLD', name: '골드 멤버십', price: 300000, priceText: '30만 원', label: 'GOLD', desc: '현지거주 초혼 + 재혼 인기 프로필 열람 가능' },
  { id: 'VIP', name: 'VIP 스페셜 멤버십', price: 500000, priceText: '50만 원', label: 'VIP', desc: '국내유학생 + 현지vip초혼 최상위 스페셜 프로필 열람 가능' }
] as const;

export const SECURITY_PLEDGE_TEXT = `[ 제1조 목 적 ]
본 서약서는 ‘Ace Match 프리미엄 결혼 서비스’(이하 '회사')에서 제공하는 미공개 국제결혼 매칭용 신부 정보(사진, 동영상, 개인 인적사항 등 일체의 프로필)를 열람함에 있어, 철저한 비밀 유지와 유출 방지 및 보안 준수 사항을 규정함을 목적으로 합니다.

[ 제2조 정보보호 및 제3자 제공 금지 ]
1. 회원은 서비스 가입 후 갤러리 및 상세 프로필 화면에서 취득한 모든 신부의 신상 정보(이름, 사진, 신체 사이즈, 지역, 서류 등)를 본인의 매칭 검토 목적 이외의 용도로 사용할 수 없습니다.
2. 어떠한 경우에도 화면을 캡처, 촬영, 복사하여 타인에게 전송하거나 인터넷 커뮤니티, SNS, 블로그 등에 게재하는 행위를 절대 금지합니다.
3. 양사 매칭이 성사되기 전 단계에서 상대방 신부의 주소나 Zalo 아이디 등을 무단으로 유출하여 제3자에게 소개하는 행위 역시 강력 금지됩니다.

[ 제3조 위반 시 손해배상 청구 ]
1. 만일 회원이 미공개 프로필 정보를 무단 전재, 유출, 전송하거나 상업적으로 악용하여 신부 개인 혹은 본 회사의 신용과 명예를 실추시킨 경우, 회원은 민·형사상의 책임을 전적으로 부담합니다.
2. 회사는 본 서약서의 위반 사실이 적발되는 즉시, 회원 자격의 영구 블랙리스트 등록 및 구글 스프레드시트 내 등급을 [BLACK]으로 조치하며, 민법 제390조(채무불이행과 손해배상) 및 제750조(불법행위의 내용)에 의거하여 금 50,000,000원(금 오천만 원 정)을 손해배상 예정액으로 청구하게 됩니다.

[ 제4조 관할 법원 ]
본 서약서의 내용과 관련하여 분쟁이 발생할 경우, 소송의 관할은 서울중앙지방법원을 전담 관할 법원으로 지정하는 것에 상호 합의합니다.

본 서약서는 동의 버튼을 클릭하여 본인 인증을 완료함과 동시에 법적으로 유효한 디지털 전자서명과 동일한 효력을 발휘합니다.
`;

const FIRST_BRONZE: BrideProfile = {
  id: 'b1',
  name: '응우옌 티 마이 (Nguyen Thi Mai)',
  age: 22,
  height: 162,
  weight: 47,
  location: '베트남 하이퐁 (Hai Phong)',
  grade: 'BRONZE',
  avatarUrl: '/src/assets/images/bride_bronze_portrait_1783283426628.jpg',
  bestPhotos: ['/src/assets/images/bride_bronze_portrait_1783283426628.jpg'],
  hiddenPhotos: [
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400'
  ],
  zaloVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-beautiful-woman-smiling-at-camera-40333-large.mp4',
  verificationDocUrl: '#',
  shortBio: '차분하고 긍정적인 성격을 가졌으며 한국어 공부를 열심히 하고 있습니다. 따뜻한 가정을 이루는 것이 꿈입니다.',
  isNewFace: true
};

const FIRST_SILVER: BrideProfile = {
  id: 'b2',
  name: '팜 투이 린 (Pham Thuy Linh)',
  age: 23,
  height: 165,
  weight: 49,
  location: '베트남 호치민 (Ho Chi Minh)',
  grade: 'SILVER',
  avatarUrl: '/src/assets/images/bride_silver_portrait_1783283416192.jpg',
  bestPhotos: ['/src/assets/images/bride_silver_portrait_1783283416192.jpg'],
  hiddenPhotos: [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400&h=400'
  ],
  zaloVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-long-hair-smiling-and-looking-away-40509-large.mp4',
  verificationDocUrl: '#',
  shortBio: '다정다감하며 밝은 성격의 소유자입니다. 회계학을 전공하였으며 예의 바르고 성실한 생활 습관을 갖고 있습니다.',
  isMeetingWithOther: true
};

const FIRST_GOLD: BrideProfile = {
  id: 'b3',
  name: '레 티 후엔 (Le Thi Huyen)',
  age: 24,
  height: 163,
  weight: 46,
  location: '베트남 다낭 (Da Nang)',
  grade: 'GOLD',
  avatarUrl: '/src/assets/images/bride_gold_portrait_1783283400931.jpg',
  bestPhotos: ['/src/assets/images/bride_gold_portrait_1783283400931.jpg'],
  hiddenPhotos: [
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400&h=400'
  ],
  zaloVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-happy-and-playful-woman-posing-with-a-flower-40618-large.mp4',
  verificationDocUrl: '#',
  shortBio: '음악 감상과 요리를 좋아하는 감수성 풍부한 신부입니다. 성격이 차분하며 서로 존중하는 가정을 원합니다.',
  isMarried: true
};

const FIRST_VIP: BrideProfile = {
  id: 'b4',
  name: '쩐 티 탄 하 (Tran Thi Thanh Ha)',
  age: 25,
  height: 168,
  weight: 48,
  location: '베트남 하노이 (Hanoi)',
  grade: 'VIP',
  avatarUrl: '/src/assets/images/bride_vip_portrait_1783283390039.jpg',
  bestPhotos: ['/src/assets/images/bride_vip_portrait_1783283390039.jpg'],
  hiddenPhotos: [
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400&h=400'
  ],
  zaloVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-with-natural-look-smiling-at-camera-40150-large.mp4',
  verificationDocUrl: '#',
  shortBio: '지적이고 교양이 풍부한 VIP 대표 신부입니다. 대학에서 한국어 교육을 부전공하여 의사소통이 원활합니다. 온화하고 고상한 성격입니다.',
  isNewFace: true
};

const VIET_LAST_NAMES = ['응우옌', '레', '팜', '부', '호앙', '쩐', '보', '당', '부이', '도', '람', '트린', '마이'];
const VIET_MIDDLE_NAMES = ['티', '홍', '투이', '응옥', '칸', '이엔', '안', '마이', '민', '짱', '빅', '후엔'];
const VIET_FIRST_NAMES = ['마이', '비', '프엉', '아인', '옥', '린', '장', '챠우', '옌', '후엔', '야우', '짱', '하', '흥', '니', '람', '롄', '꾸이', '융', '꾹'];

const VIET_CITIES = [
  '베트남 하이퐁 (Hai Phong)',
  '베트남 껀터 (Can Tho)',
  '베트남 응에안 (Nghe An)',
  '베트남 남딘 (Nam Dinh)',
  '베트남 하이즈엉 (Hai Duong)',
  '베트남 호치민 (Ho Chi Minh)',
  '베트남 하노이 (Hanoi)',
  '베트남 다낭 (Da Nang)',
  '베트남 빈즈엉 (Binh Duong)',
  '베트남 냐짱 (Nha Trang)',
  '베트남 달랏 (Da Lat)',
  '베트남 타인호아 (Thanh Hoa)',
  '베트남 꽝닌 (Quang Ninh)'
];

const BIOS = [
  '차분하고 긍정적인 성격을 가졌으며 한국어 공부를 열심히 하고 있습니다. 따뜻한 가정을 이루는 것이 꿈입니다.',
  '네일 아트를 배우고 있으며 밝고 애교 넘치는 성격입니다. 성실한 한국 남성분을 만나 행복한 가정을 꾸리고 싶습니다.',
  '차분하고 생각이 깊은 성격입니다. 요리하는 것을 매우 좋아하며 한식도 열심히 공부해서 배워보고 싶습니다.',
  '성실하고 긍정적인 가치관을 갖고 있으며 웃음이 많습니다. 서로를 존중하며 다정한 삶을 살아갈 배필을 찾습니다.',
  '언제나 긍정적인 마음가짐을 소유하고 있으며 남을 배려할 줄 압니다. 성실하고 가정에 헌신적인 남성분을 고대합니다.',
  '다정다감하며 밝은 성격의 소유자입니다. 회계학을 전공하였으며 예의 바르고 성실한 생활 습관을 갖고 있습니다.',
  '영어 의사소통이 가능하며 무척 야무지고 현명한 신부입니다. 성숙한 매력이 돋보이며 가사일도 좋아합니다.',
  '피부 미용 관련 일을 하고 있으며 미소가 아주 우아한 신부입니다. 남을 배려할 줄 아는 성품을 갖추고 있습니다.',
  '다정하고 온화한 남편을 찾고 있는 대졸 출신 신부입니다. 아이들을 사랑하며 가족을 최우선으로 생각합니다.',
  '음악 감상과 요리를 좋아하는 감수성 풍부한 신부입니다. 성격이 차분하며 서로 존중하는 가정을 원합니다.',
  '비율이 아주 훌륭하며, 패션 및 모델 감각이 돋보이는 인기 신부입니다. 애교와 애정이 아주 많습니다.',
  '대학병원 물리치료사 출신으로 지적이고 배려심 깊은 엘리트 신부입니다. 고운 마음씨와 상냥함이 큰 매력입니다.',
  '유치원 교사 경력이 있어 정이 깊고 고운 목소리의 소유자입니다. 다정한 시선으로 아이들과 가정을 잘 가꿀 준비가 되어있습니다.',
  '지적이고 교양이 풍부한 VIP 대표 신부입니다. 대학에서 한국어 교육을 부전공하여 의사소통이 원활합니다.',
  '대학 무역학부 졸업 후 현지 회사에서 근무 중인 지성미 넘치는 신부입니다. 뛰어난 소통 능력을 갖고 있습니다.',
  '플로리스트 디자인 샵을 운영하는 감각적이고 고혹적인 미모의 신부입니다. 세련된 매너와 다정한 마음가짐을 가지고 있습니다.',
  '한국어 말하기 대회 수상 경력이 있을 만큼 한국어 실력이 유창한 신부입니다. 깊은 가족애를 최우선으로 여깁니다.'
];

const UNSPLASH_POOL = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d',
  'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4',
  'https://images.unsplash.com/photo-1548142813-c348350df52b',
  'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
  'https://images.unsplash.com/photo-1541647376583-d933cd90653f',
  'https://images.unsplash.com/photo-1513245543132-31f507417b26',
  'https://images.unsplash.com/photo-1481214110143-ed630356e1bb',
  'https://images.unsplash.com/photo-1485199692108-c3b5069de6a0',
  'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6',
  'https://images.unsplash.com/photo-1521119989659-a83eee488004',
  'https://images.unsplash.com/photo-1525134479668-1bee5c7c684a',
  'https://images.unsplash.com/photo-1526511582091-a1340de3a8e5',
  'https://images.unsplash.com/photo-1530268729831-4b0b9e170218'
];

function generateProfiles(
  grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'VIP',
  count: number,
  firstExisting: BrideProfile,
  startIndex: number = 2
): BrideProfile[] {
  const list: BrideProfile[] = [firstExisting];
  
  for (let i = startIndex; i <= count; i++) {
    const seed = grade.charCodeAt(0) + grade.charCodeAt(1) * 31 + i * 17;
    
    // Pick name
    const last = VIET_LAST_NAMES[seed % VIET_LAST_NAMES.length];
    const mid = VIET_MIDDLE_NAMES[(seed + 3) % VIET_MIDDLE_NAMES.length];
    const first = VIET_FIRST_NAMES[(seed + 7) % VIET_FIRST_NAMES.length];
    const koreanName = `${last} ${mid} ${first}`;
    
    const engLast = last === '응우옌' ? 'Nguyen' : last === '레' ? 'Le' : last === '팜' ? 'Pham' : last === '부' ? 'Vu' : last === '호앙' ? 'Hoang' : last === '쩐' ? 'Tran' : last === '보' ? 'Vo' : last === '당' ? 'Dang' : last === '부이' ? 'Bui' : last === '도' ? 'Do' : 'Nguyen';
    const engMid = mid === '티' ? 'Thi' : mid === '홍' ? 'Hong' : mid === '투이' ? 'Thuy' : mid === '응옥' ? 'Ngoc' : mid === '칸' ? 'Khanh' : mid === '이엔' ? 'Yen' : mid === '안' ? 'Anh' : mid === '마이' ? 'Mai' : mid === '민' ? 'Minh' : mid === '짱' ? 'Trang' : 'Thi';
    const engFirst = first === '마이' ? 'Mai' : first === '비' ? 'Bich' : first === '프엉' ? 'Phuong' : first === '아인' ? 'Anh' : first === '옥' ? 'Ngoc' : first === '린' ? 'Linh' : first === '장' ? 'Giang' : first === '챠우' ? 'Chau' : first === '옌' ? 'Yen' : first === '후엔' ? 'Huyen' : 'Mai';
    const fullName = `${koreanName} (${engLast} ${engMid} ${engFirst})`;
    
    const age = 20 + (seed % 7); // 20 ~ 26
    const height = 159 + (seed % 11); // 159 ~ 169
    const weight = 44 + (seed % 9); // 44 ~ 52
    
    const location = VIET_CITIES[(seed + 5) % VIET_CITIES.length];
    
    const imgIndex = (seed + i) % UNSPLASH_POOL.length;
    const avatarUrl = `${UNSPLASH_POOL[imgIndex]}?auto=format&fit=crop&q=80&w=400&h=500`;
    
    const bestPhotos = [avatarUrl];
    const hiddenPhotos = [
      `${UNSPLASH_POOL[(imgIndex + 1) % UNSPLASH_POOL.length]}?auto=format&fit=crop&q=80&w=400&h=400`,
      `${UNSPLASH_POOL[(imgIndex + 2) % UNSPLASH_POOL.length]}?auto=format&fit=crop&q=80&w=400&h=400`,
      `${UNSPLASH_POOL[(imgIndex + 3) % UNSPLASH_POOL.length]}?auto=format&fit=crop&q=80&w=400&h=400`
    ];
    
    const shortBio = BIOS[seed % BIOS.length];
    
    const id = grade === 'BRONZE' ? `b1_${i}` : grade === 'SILVER' ? `b2_${i}` : grade === 'GOLD' ? `b3_${i}` : `b4_${i}`;
    
    const isNewFace = (i === 2 || i === 8 || i === 15 || i === 23);
    const isMeetingWithOther = (i === 3 || i === 9 || i === 19);
    const isMarried = (i === 5 || i === 12 || i === 27);

    list.push({
      id,
      name: fullName,
      age,
      height,
      weight,
      location,
      grade,
      avatarUrl,
      bestPhotos,
      hiddenPhotos,
      zaloVideoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-beautiful-woman-smiling-at-camera-40333-large.mp4',
      verificationDocUrl: '#',
      shortBio,
      isNewFace,
      isMeetingWithOther,
      isMarried
    });
  }
  
  return list;
}

export const BRIDAL_CATALOG: BrideProfile[] = [
  ...generateProfiles('BRONZE', 50, FIRST_BRONZE),
  ...generateProfiles('SILVER', 30, FIRST_SILVER),
  ...generateProfiles('GOLD', 20, FIRST_GOLD),
  ...generateProfiles('VIP', 5, FIRST_VIP)
];

export const SIGN_OK_CONTRACT_TEMPLATE = `
[ 500만 원 성혼 절차 및 미팅 계약서 ]

본 계약은 ‘Ace Match 프리미엄 결혼 서비스’(이하 "갑")와 미팅 신청자(이하 "을") 간에 체결되는 프리미엄 국제결혼 성혼 및 양사 대면 미팅 주선에 관한 합의서입니다.

1. 미팅 대상자: 선택된 전담 VIP 매칭 신부
2. 계약 금액: 총 금 5,000,000원 (금 오백만 원 정)
   - 계약금 (착수금): 1,500,000원 (서명 즉시 납부)
   - 잔금: 3,500,000원 (현지 출국 및 미팅 3일 전 납부)

3. 미팅 주선 내용:
   - "갑"은 "을"이 선택한 신부와의 현지 미팅 일정을 조율하고 통역 및 가이드를 무상 제공합니다.
   - 현지 대면 미팅 결과, 본인들의 의사로 성혼 합의 시 행정 서류 절차 및 한국 초청 비자 대행 업무가 자동으로 개시됩니다.

4. 비밀유지 및 유출 책임:
   - "을"은 계약 완료 후 잠금 해제되는 신부의 일상 사진(10장), Zalo 소통 영상, 공식 사법/건강 검증 서류 등 극비 개인정보를 외부에 절대 유출하지 않아야 합니다.
   - 유출 시 약정된 손해배상 조항에 따라 엄중 사법 처리됩니다.

본 계약의 효력은 "을"이 본 전자서명(SignOK 대행)을 완료하고 계약금을 입금한 후, "갑(관리자)"이 구글 시트 상에서 최종 상태를 [계약완료]로 전환한 순간 발생하며, 해당 신부의 전용 히든 프로필 및 공식 보증 서류 일체가 즉시 잠금 해제됩니다.
`;
