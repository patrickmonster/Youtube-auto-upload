# Youtube-auto-upload


Twitch 라이브 스트리밍이 종료됨과 동시에
Youtube 업로드 시도.


main.js
  신규 사용자 및 트위치 IRC토큰이 만료 되었을 때에 갱신을 필요로 할 때에 사용되는 서버 (보조 서버)
  DB에  사용자가 토큰을 엑세스 하기 위하여 유튜브/ 트위치 각각에 리다이렉트를 통하여 사용자 oauth 2.0 토큰을 요청하고
  이를 사용자 정보와 함께 수신하여 DB로 전송함
  
index.js
  DB에 엑세스 하여, 주기적으로 사용자가 온/오프라인(방송) 여부를 확인하고, 방송이 종료되면 트위치 API를 받아 사용자 정보/ 방송정보를 통하여
  유튜브 서버에 업로드 함.
  
youtube.js
  유튜브에 데이터를 업로드 하기 위한 보조 라이브러리
