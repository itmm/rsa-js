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

	const gcd = (bn_a, bn_b) => {
		let bn_ca = bn_a;
		let bn_cb = bn_b;

		let bn_u = bigInt(1);
		let bn_s = bigInt(0);
		let bn_v = bn_s;
		let bn_t = bn_u;

		let count = 0;

		while (! bn_cb.isZero()) {
			if (++count >= 100) { alert("failed"); break; }

			const dd = bn_ca.divmod(bn_cb);
			const bn_na = bn_cb;

			const bn_nb = dd.remainder;
			const bn_nu = bn_s;
			const bn_nv = bn_t;
			const bn_ns = bn_u.subtract(dd.quotient.multiply(bn_s));
			const bn_nt = bn_v.subtract(dd.quotient.multiply(bn_t));

			bn_ca = bn_na;
			bn_cb = bn_nb;
			bn_u = bn_nu;
			bn_v = bn_nv;
			bn_s = bn_ns;
			bn_t = bn_nt;
		}
		return { a: bn_ca, u: bn_u, v: bn_v, s: bn_s, t: bn_t };
	};

	let timer;

	const refresh = () => {
		const bn_prime1 = bigInt($prime1.val());
		const bn_prime2 = bigInt($prime2.val());
		const public_key = bn_prime1.multiply(bn_prime2);
		$public_key.text(public_key.toString());
		const one = bigInt.one;
		const phi = bn_prime1.subtract(one).multiply(bn_prime2.subtract(one));
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
