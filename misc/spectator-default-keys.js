// Spectator control keys, taken from client's code

this.actions_0 = Qt([
	new Qp(Xu(), [Vp().get_bk572b$(En.ShiftLeft)]),
	new Qp(qu(), [Vp().get_bk572b$(En.Home)]),
	new Qp(Lu(), [Vp().get_bk572b$(En.End)]),
	new Qp(tl(), [Vp().get_bk572b$(En.Backquote)]),
	new Qp(el(), [Vp().get_bk572b$(En.Space)]),
	new Qp(nl(), [Vp().get_bk572b$(En.KeyV)]),
	new Qp(bl(), [Vp().get_bk572b$(En.Digit0)]),
	new Qp(pl(), [Vp().get_bk572b$(En.Digit1)]),
	new Qp(hl(), [Vp().get_bk572b$(En.Digit2)]),
	new Qp(dl(), [Vp().get_bk572b$(En.Digit3)]),
	new Qp(fl(), [Vp().get_bk572b$(En.Digit4)]),
	new Qp(ml(), [Vp().get_bk572b$(En.Digit5)]),
	new Qp(yl(), [Vp().get_bk572b$(En.Digit6)]),
	new Qp($l(), [Vp().get_bk572b$(En.Digit7)]),
	new Qp(gl(), [Vp().get_bk572b$(En.Digit8)]),
	new Qp(vl(), [Vp().get_bk572b$(En.Digit9)]),
	new Qp(Il(), [Vp().get_bk572b$(En.Digit0, !0)]),
	new Qp(wl(), [Vp().get_bk572b$(En.Digit1, !0)]),
	new Qp(Cl(), [Vp().get_bk572b$(En.Digit2, !0)]),
	new Qp(Sl(), [Vp().get_bk572b$(En.Digit3, !0)]),
	new Qp(kl(), [Vp().get_bk572b$(En.Digit4, !0)]),
	new Qp(Pl(), [Vp().get_bk572b$(En.Digit5, !0)]),
	new Qp(jl(), [Vp().get_bk572b$(En.Digit6, !0)]),
	new Qp(xl(), [Vp().get_bk572b$(En.Digit7, !0)]),
	new Qp(Ol(), [Vp().get_bk572b$(En.Digit8, !0)]),
	new Qp(Tl(), [Vp().get_bk572b$(En.Digit9, !0)]),
	new Qp(sl(), [Vp().get_bk572b$(En.KeyX)]),
	new Qp(al(), [Vp().get_bk572b$(En.KeyZ)]),
	new Qp(ll(), [Vp().get_bk572b$(En.KeyT)]),
	new Qp(ll(), [Vp().get_bk572b$(En.KeyU, !0)]),
	new Qp(cl(), [Vp().get_bk572b$(En.KeyR, !0)]),
	new Qp(ul(), [Vp().get_bk572b$(En.KeyB, !0)]),
	new Qp(il(), [Vp().get_bk572b$(En.Backslash)]),
	new Qp(_l(), [Vp().get_bk572b$(En.KeyC)]),
	new Qp(rl(), [Vp().get_bk572b$(En.AltLeft)]),
	new Qp(ol(), [Vp().get_bk572b$(En.KeyO)])
]);

this.axes_0 = Qt([
	new Xp(po(), 1, [Vp().get_bk572b$(En.KeyW)]),
	new Xp(po(), -1, [Vp().get_bk572b$(En.KeyS)]),
	new Xp(ho(), 1, [Vp().get_bk572b$(En.KeyD)]),
	new Xp(ho(), -1, [Vp().get_bk572b$(En.KeyA)]),
	new Xp(fo(), 1, [Vp().get_bk572b$(En.KeyE)]),
	new Xp(fo(), -1, [Vp().get_bk572b$(En.KeyQ)]),
	new Xp(lo(), 1, [Vp().get_bk572b$(En.ArrowUp)]),
	new Xp(lo(), -1, [Vp().get_bk572b$(En.ArrowDown)]),
	new Xp(_o(), -1, [Vp().get_bk572b$(En.ArrowRight)]),
	new Xp(_o(), 1, [Vp().get_bk572b$(En.ArrowLeft)]),
	new Xp(lo(), 1, [Vp().get_bk572b$(En.KeyU)]),
	new Xp(lo(), -1, [Vp().get_bk572b$(En.KeyJ)]),
	new Xp(_o(), -1, [Vp().get_bk572b$(En.KeyK)]),
	new Xp(_o(), 1, [Vp().get_bk572b$(En.KeyH)])
]);

this.pointers_0 = Qt([
	new Zp(Hl(), [na()]),
	new Zp(Gl(), [oa()]),
	new Zp(Wl(), [ia()])
]);

// User

this.actions_0 = Qt([
	new oh(Wu(), xn.Companion.moveActions),
	new oh(Pu(), re(On.CenterTurret)),
	new oh(qu(), re(On.MoveCameraUp)),
	new oh(Lu(), re(On.MoveCameraDown)),
	new oh(Tu(), re(On.DropFlag)),
	new oh(Eu(), re(On.UseFirstAidSupply)),
	new oh(Nu(), re(On.UseDoubleArmorSupply)),
	new oh(Au(), re(On.UseDoubleDamageSupply)),
	new oh(Ru(), re(On.UseSpeedBoostSupply)),
	new oh(zu(), re(On.DropMine)),
	new oh(Mu(), re(On.UseGoldBoxSupply)),
	new oh(Cu(), re(On.Shoot)),
	new oh(Ou(), re(On.Overdrives)),
	new oh(Iu(), re(On.SelfDestroy)),
	new oh(ju(), re(On.RotateTurretRight)),
	new oh(xu(), re(On.RotateTurretLeft)),
	new oh(Fu(), re(On.MoveTankForward)),
	new oh(Uu(), re(On.MoveTankBackwards)),
	new oh(Du(), Qt([On.TurnTankLeft, On.RotateTurretLeft])),
	new oh(Bu(), Qt([On.TurnTankRight, On.RotateTurretRight]))
]);
