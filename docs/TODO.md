# 기능 목록
## DataManager
- [x] mongoose 연결
- [x] 기준 객체 반복 실행
## StatusManager
- [x] 기준 시간 객체 생성
- [x] 상태 기능
    - [x] 상태 저장 기능
    - [x] 상태 출력 기능
        - [x] 상태가 수신/저장/로그 순으로 처리중인지, 완료인지에 따라 알맞게 출력
    - [x] 상태 갱신 기능
## Receiver
- [x] 기준 시간 연동
- [x] 데이터 수신
## Saver
- [x] 세이버 객체 초기화
    - [x] bulkWrite를 위한 upsertDoc 생성 (Station, Charger)
    - [x] Station과 Charger 데이터 저장

## Logger
- [x] 로그 객체 초기화
    - [x] 로그 정제
    - [x] 로그 저장
    