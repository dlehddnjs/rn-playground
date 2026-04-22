# rn-playground

> React Native UI 컴포넌트 · 제스처 인터랙션 · SVG 기반 시각화 실험 저장소

실무에서 맞닥뜨린 인터랙션 문제들을 작게 재현해보고, 개선 아이디어를 실험한 개인 작업 공간입니다.
컴포넌트 단위로 독립 실행 가능하게 구성되어 있어, 필요한 부분만 꺼내 쓰거나 학습용으로 참고할 수 있습니다.

<br />

## 담긴 것들

### 🎠 Carousel / Slider
Reanimated 기반의 스와이프 캐러셀. PanResponder로 제스처를 받고, 터치 이탈 시의 관성 계산과 스냅 복귀까지 자연스럽게 동작하도록 구현했습니다.

- 무한 루프 처리
- 자동 재생 / 수동 전환 전환 가능
- 페이지 인디케이터 동기화

<img width="400" alt="image" src="https://github.com/user-attachments/assets/4546c476-4b94-43e7-a84a-cd6abc7a49e5" />

<br />

### 📈 SVG Graph / Chart Animation
`react-native-svg`로 그린 그래프에 Reanimated의 `useAnimatedProps`를 연결해, 데이터 변경 시 자연스러운 트랜지션을 주는 실험입니다.

- 라인 차트의 path 애니메이션 (`strokeDasharray`, `strokeDashoffset`)
- 값 변경 시 interpolation 기반 부드러운 전환
- 터치 포인트에 따른 hover 툴팁 구현

<img width="400" alt="image" src="https://github.com/user-attachments/assets/ad07fee5-1a49-407c-b25e-97a53e2b492a" />
<img width="400" alt="image" src="https://github.com/user-attachments/assets/2ed668c8-9f9e-4b46-ad0a-9a8869ba355a" />


<br />

## 기술 선택 기준

### 왜 Reanimated 인가
- UI 스레드에서 직접 돌아가 JS 브릿지 병목이 없음
- 복잡한 인터랙션에서도 60fps 유지가 현실적으로 가능
- `useAnimatedStyle` / `useAnimatedProps` API가 선언적이라 유지보수하기 좋음

### 왜 react-native-svg인가
- 해상도 독립적인 렌더링이 필요한 차트·그래프에 가장 적합
- Reanimated와의 조합이 자연스러워, 경로 기반 애니메이션을 선언적으로 짤 수 있음

<br />

## 실행 방법

```bash
# 1. 저장소 클론
git clone https://github.com/dlehddnjs/rn-playground.git
cd rn-playground

# 2. 의존성 설치
yarn install

# iOS 추가 설치 (Mac 환경)
cd ios && pod install && cd ..

# 3. Metro 실행
yarn start

# 4. 앱 실행
yarn ios     # iOS
yarn android # Android
```

> 이 저장소는 RN CLI 기반입니다. Expo Go에서는 동작하지 않습니다.

<br />

## 기술 스택

- React Native (RN CLI)
- TypeScript
- Reanimated
- react-native-svg
- react-native-gesture-handler / PanResponder

<br />
