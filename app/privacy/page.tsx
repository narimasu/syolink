export default function PrivacyPage() {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6">プライバシーポリシー</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 prose prose-primary max-w-none">
          <p className="text-gray-500 mb-6">
            最終更新日: 2023年5月1日
          </p>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. はじめに</h2>
            <p>
              syolink（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
              このプライバシーポリシーでは、当サービスがどのような情報を収集し、どのように利用するかについて説明します。
              当サービスを利用することで、このプライバシーポリシーに同意したものとみなされます。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. 収集する情報</h2>
            <p>当サービスでは、以下の情報を収集することがあります：</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>
                <strong>アカウント情報</strong>：ユーザー名、メールアドレス、パスワード（暗号化されて保存）などの登録情報
              </li>
              <li>
                <strong>プロフィール情報</strong>：プロフィール画像、自己紹介などのユーザーが提供する任意の情報
              </li>
              <li>
                <strong>投稿コンテンツ</strong>：書道作品の画像、タイトル、説明文、コメントなどユーザーが当サービス上で投稿する情報
              </li>
              <li>
                <strong>ログ情報</strong>：IPアドレス、ブラウザの種類、訪問日時、参照元ページなどの技術的情報
              </li>
              <li>
                <strong>Cookie情報</strong>：当サービスの利用状況に関する情報
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. 情報の利用目的</h2>
            <p>収集した情報は、以下の目的で利用します：</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>当サービスの提供および運営</li>
              <li>ユーザーからのお問い合わせや要望への対応</li>
              <li>サービスの改善や新機能の開発</li>
              <li>セキュリティの確保およびトラブル対応</li>
              <li>利用規約違反の調査</li>
              <li>統計データの作成（個人を特定しない形式）</li>
              <li>サービスに関する重要なお知らせの配信</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. 情報の共有と開示</h2>
            <p>
              当サービスは、以下の場合を除き、ユーザーの個人情報を第三者と共有または開示することはありません：
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合や法的手続きに対応する必要がある場合</li>
              <li>ユーザーや他者の権利、財産、安全を保護するために必要な場合</li>
              <li>サービス提供のために協力している第三者（データベース管理、ホスティングサービスなど）との共有。
                この場合、これらの第三者はユーザーの個人情報を当サービスの指示に従ってのみ処理し、他の目的では使用しません。</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. 情報の保護</h2>
            <p>
              当サービスは、収集した個人情報の安全性を確保するために、適切な技術的・組織的対策を講じています。
              しかし、インターネットを通じた情報の送信は完全に安全ではなく、100%の安全性を保証することはできません。
              ユーザーご自身でもパスワードの適切な管理など、セキュリティ対策にご協力ください。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. Cookieの使用</h2>
            <p>
              当サービスでは、より良いユーザー体験を提供するためにCookieを使用しています。
              Cookieは、ユーザーのブラウザに保存される小さなテキストファイルで、ユーザーの設定やログイン状態を記憶するために使用されます。
              ブラウザの設定からCookieを無効にすることも可能ですが、その場合、当サービスの一部機能が利用できなくなる可能性があります。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. ユーザーの権利</h2>
            <p>ユーザーには以下の権利があります：</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>個人情報へのアクセス権</li>
              <li>個人情報の訂正または更新を要求する権利</li>
              <li>個人情報の削除を要求する権利（一部例外あり）</li>
              <li>個人情報の処理に関する制限を要求する権利</li>
              <li>個人データのポータビリティを要求する権利</li>
            </ul>
            <p className="mt-2">
              これらの権利を行使するには、<a href="/contact" className="text-primary-500 hover:underline">お問い合わせフォーム</a>からご連絡ください。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. 児童のプライバシー</h2>
            <p>
              当サービスは、13歳未満の児童を対象としていません。
              13歳未満の児童から個人情報を収集していると認識した場合、速やかにその情報を削除するよう努めます。
              お子様の情報が当サービスに収集されていると思われる場合は、お問い合わせフォームからご連絡ください。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">9. プライバシーポリシーの変更</h2>
            <p>
              当サービスは、必要に応じてこのプライバシーポリシーを変更することがあります。
              変更があった場合は、当サービス上で通知し、更新日を最新の日付に変更します。
              定期的にこのページを確認することをお勧めします。
              変更後も継続して当サービスを利用する場合、変更後のプライバシーポリシーに同意したものとみなされます。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">10. お問い合わせ</h2>
            <p>
              このプライバシーポリシーに関するご質問やご意見がありましたら、
              <a href="/contact" className="text-primary-500 hover:underline">お問い合わせフォーム</a>から、
              または以下のメールアドレスまでご連絡ください。
            </p>
            <p className="mt-2">
              Eメール: privacy@syolink.example.com
            </p>
          </section>
        </div>
      </div>
    );
  }