export default function TermsPage() {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="mb-6">利用規約</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 prose prose-primary max-w-none">
          <p className="text-gray-500 mb-6">
            最終更新日: 2023年5月1日
          </p>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">1. はじめに</h2>
            <p>
              この利用規約（以下「本規約」）は、syolink（以下「当サービス」）の利用条件を定めるものです。
              ユーザーの皆様（以下「ユーザー」）には、本規約に同意いただいた上で、当サービスをご利用いただきます。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">2. 定義</h2>
            <p>本規約において使用する用語の定義は、以下の通りとします。</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>「当サービス」とは、syolinkが提供する書道の作品や練習のための掲示板Webサービスを指します。</li>
              <li>「コンテンツ」とは、当サービス上で投稿、アップロード、共有される文章、画像、その他の情報を指します。</li>
              <li>「ユーザー」とは、当サービスを利用するすべての個人または法人を指します。</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">3. アカウント</h2>
            <p>当サービスの一部機能を利用するには、アカウント登録が必要です。アカウントについて、以下の事項に同意していただきます。</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>ユーザーは、正確かつ最新の情報を提供する責任があります。</li>
              <li>アカウントの認証情報（パスワードなど）は安全に保管し、第三者に開示しないようにしてください。</li>
              <li>アカウントに関連するすべての活動について、ユーザーは責任を負います。</li>
              <li>不正アクセスまたはセキュリティ上の問題が発生した場合は、直ちに当サービスの管理者に通知してください。</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">4. 利用制限</h2>
            <p>当サービスの利用にあたり、以下の行為を禁止します。</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>法令に違反する行為</li>
              <li>公序良俗に反する行為</li>
              <li>他のユーザーや第三者の権利を侵害する行為</li>
              <li>他のユーザーや第三者を誹謗中傷する行為</li>
              <li>当サービスの運営を妨げる行為</li>
              <li>不正アクセスや不正行為を行う行為</li>
              <li>商業目的での利用（当サービスの管理者の許可がない場合）</li>
              <li>その他、当サービスの管理者が不適切と判断する行為</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">5. コンテンツの投稿</h2>
            <p>ユーザーが当サービスに投稿するコンテンツについて、以下の事項に同意していただきます。</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>投稿するコンテンツは、ユーザー自身が著作権を有するもの、または投稿する権利を有するものに限ります。</li>
              <li>投稿したコンテンツについての著作権はユーザーに帰属しますが、当サービス上での表示、共有、保存に必要な範囲で使用する権利を当サービスに許諾するものとします。</li>
              <li>当サービスは投稿されたコンテンツをサービスの宣伝や改善のために使用する場合があります。</li>
              <li>違法または不適切なコンテンツの投稿は禁止されており、当サービスの管理者の判断で削除される場合があります。</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">6. 免責事項</h2>
            <p>以下の事項について、当サービスは責任を負いません。</p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>当サービスの利用によって生じたユーザーの損害</li>
              <li>当サービス上のコンテンツの正確性、完全性、適法性</li>
              <li>当サービスの中断、停止、終了、変更、または障害</li>
              <li>ユーザー間または第三者とユーザー間のトラブル</li>
              <li>ユーザーが投稿したコンテンツによる権利侵害</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">7. サービスの変更と終了</h2>
            <p>
              当サービスは、予告なくサービス内容の変更、追加、中断、または終了する場合があります。
              これによりユーザーに損害が発生した場合でも、当サービスは一切の責任を負いません。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">8. プライバシー</h2>
            <p>
              当サービスのプライバシーポリシーは、本規約の一部を構成します。
              プライバシーポリシーについては、<a href="/privacy" className="text-primary-500 hover:underline">プライバシーポリシーページ</a>をご参照ください。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">9. 規約の変更</h2>
            <p>
              当サービスは、必要に応じて本規約を変更することがあります。
              変更後の規約は、当サービス上に表示した時点で効力を生じるものとします。
              継続して当サービスを利用する場合、変更後の規約に同意したものとみなされます。
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">10. 連絡先</h2>
            <p>
              本規約に関するお問い合わせは、<a href="/contact" className="text-primary-500 hover:underline">お問い合わせフォーム</a>から、または以下のメールアドレスまでご連絡ください。
            </p>
            <p className="mt-2">
              Eメール: support@syolink.example.com
            </p>
          </section>
        </div>
      </div>
    );
  }