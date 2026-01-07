// Floating Panel for Automation
const panel = document.createElement('div');
panel.style.cssText = `
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 2px solid #8E7CC3;
  border-radius: 12px;
  padding: 16px;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  width: 250px;
  font-family: sans-serif;
`;

const title = document.createElement('div');
title.innerText = '四柱推命 自動入力';
title.style.cssText = 'font-weight: bold; color: #8E7CC3; margin-bottom: 12px; text-align: center;';
panel.appendChild(title);

const desc = document.createElement('div');
desc.innerText = '入力欄をクリックしてから\n下のボタンを押してください';
desc.style.cssText = 'font-size: 12px; color: #666; margin-bottom: 12px; line-height: 1.4;';
panel.appendChild(desc);

const btn = document.createElement('button');
btn.innerText = '📋 データを貼り付け';
btn.style.cssText = `
  width: 100%;
  background: #8E7CC3;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
`;
btn.onmouseover = () => btn.style.opacity = '0.9';
btn.onmouseout = () => btn.style.opacity = '1';

const status = document.createElement('div');
status.style.cssText = 'font-size: 11px; margin-top: 8px; color: #E91E63; text-align: center; min-height: 16px;';

btn.onclick = async () => {
    try {
        status.innerText = '読み込み中...';
        // Read clipboard
        const text = await navigator.clipboard.readText();
        if (!text) {
            status.innerText = 'クリップボードが空です';
            return;
        }

        // Find target
        let target = document.activeElement;
        if (!target || (target.tagName !== 'TEXTAREA' && target.tagName !== 'INPUT')) {
            // Try to find the first textarea if active element is not input
            target = document.querySelector('textarea');
            if (!target) {
                status.innerText = '入力欄が見つかりません';
                return;
            }
        }

        // Fill data
        // Assuming simple replacement. If append is needed, use target.value +=
        // User requested "input data", likely replace or append. 
        // Usually new schedule = replace or append? Safest is to append if not empty, otherwise set.
        // If user clears it manually, set.
        // Let's Insert at cursor or Append.
        const start = target.selectionStart || 0;
        const end = target.selectionEnd || 0;
        const current = target.value;
        target.value = current.substring(0, start) + text + current.substring(end);

        // Trigger input event for React/Vue handlers
        target.dispatchEvent(new Event('input', { bubbles: true }));
        target.dispatchEvent(new Event('change', { bubbles: true }));

        status.innerText = '貼り付け成功！';
        setTimeout(() => {
            // Try to find save button?
            // User said: "Press save button".
            // I'll look for a button containing "保存" or "Save" or type="submit"
            // But be careful not to logout.
            // I will just leave it at paste for safety unless requested hard.
            // User asked "Press save button".
            // I'll try to find it.
            const allBtns = Array.from(document.querySelectorAll('button, input[type="submit"]'));
            const saveBtn = allBtns.find(b => b.innerText.includes('保存') || b.value.includes('保存') || b.innerText.includes('Save'));

            if (saveBtn) {
                status.innerText = '保存ボタンを押します...';
                setTimeout(() => saveBtn.click(), 1000); // Delay for visual confirm
            } else {
                status.innerText = '保存ボタンが見つかりません';
            }
        }, 800);

    } catch (err) {
        console.error(err);
        status.innerText = 'エラー: ' + err.message;
    }
};

panel.appendChild(btn);
panel.appendChild(status);
document.body.appendChild(panel);
