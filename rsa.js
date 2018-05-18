jQuery(($) => {
	const $prime1 = $('#prime-1');
	const $prime2 = $('#prime-2');
	const $public_key = $('#public-key');
	const $private_key = $('#private-key');
	const $phi = $('#phi');
	const $gcd = $('#gcd');
	const $e = $('#base');
	const $private_message = $('#private-message');
	const $public_message = $('#public-message');
	const $direction = $('#direction');

	let encrypt = true;

	const gcd = (a, b) => {
		let ca = a;
		let cb = b;

		let u = bigInt.one;
		let s = bigInt.zero;
		let v = s;
		let t = u;

		let count = 0;

		while (! cb.isZero()) {
			if (++count >= 100) { alert("failed"); break; }

			const dd = ca.divmod(cb);
			const na = cb;

			const nb = dd.remainder;
			const nu = s;
			const nv = t;
			const ns = u.subtract(dd.quotient.multiply(s));
			const nt = v.subtract(dd.quotient.multiply(t));

			ca = na;
			cb = nb;
			u = nu;
			v = nv;
			s = ns;
			t = nt;
		}
		return { a: ca, u: u, v: v, s: s, t: t };
	};

	let timer;

	const refresh = () => {
		const prime1 = bigInt($prime1.val());
		const prime2 = bigInt($prime2.val());
		const public_key = prime1.multiply(prime2);
		$public_key.text(public_key.toString());
		const one = bigInt.one;
		const phi = prime1.subtract(one).multiply(prime2.subtract(one));
		$phi.text(phi.toString());
		const e = bigInt($e.val());
		const gg = gcd(phi, e);
		$gcd.text(gg.a.toString());
		const private_key = gg.v;
		$private_key.text(private_key.toString());

		if (encrypt) {
			const source = bigInt($private_message.val());
			const encrypted = source.modPow(e, public_key);
			$public_message.val(encrypted.toString());
		} else {
			const source = bigInt($public_message.val());
			const decrypted = source.modPow(private_key, public_key);
			$private_message.val(decrypted.toString());
		}

		timer = null;
	};

	const setEncrypt = (new_encrypt) => {
		if (encrypt === new_encrypt) { return; }
		encrypt = new_encrypt;
		if (encrypt) {
			$direction.removeClass('flip');
			$direction.addClass('flop');
		} else {
			$direction.removeClass('flop');
			$direction.addClass('flip');
		}
	};

	const queueRefresh = (event) => {
		event.preventDefault();
		if (! timer) {
			refresh();
		} else {
			clearTimeout(timer);
			$public_key.text('...');
			$phi.text('...');
			$gcd.text('...');
			$private_key.text('...');

			if (encrypt) {
				$public_message.val('...');
			} else {
				$private_message.val('...');
			}
		}
		timer = setTimeout(refresh, 500);
	}

	$prime1.on('input', queueRefresh);
	$prime2.on('input', queueRefresh);
	$e.on('input', queueRefresh);
	$private_message.on('input', (event) => { setEncrypt(true); queueRefresh(event); });
	$public_message.on('input', (event) => { setEncrypt(false); queueRefresh(event); });
	refresh();
});
