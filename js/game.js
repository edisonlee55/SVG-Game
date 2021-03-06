/*!
 * SVG Game - game.js
 * Copyright 2017 Edison Lee
 */
$(function() {

    function randomNext(min, max) {
        return Math.random() * (max - min) + min;
    }

    var s = Snap("#svg");

    var fighter = s.circle(300, 750, 20).attr({
        fill: 'green',
        stroke: 'black',
        strokeWidth: 5
    });
    var enimies = [];
    var fighterx = fighter.attr("cx");
    for (var i = 0; i < 600 / 50; i++) {
        enimies[i] = s.circle(25 + i * 50, 50, 20);
        enimies[i].animate({
            cy: 750
        }, 100000);
    }
    var blueenimies = [];
    for (var i = 0; i < 3; i++) {
        blueenimies[i] = s.circle(25 + (randomNext(30, 50) * (i + 1) * 50) % 550, 100, 20).attr({
            fill: 'blue'
        });
        blueenimies[i].animate({
            cy: 750,
            cx: fighterx
        }, 50000);
    }
    var point = 0;
    var nowbullet = [];
    var nowshotbullet = [];
    for (var i = 0; i < 20; i++) {
        nowbullet[i] = s.circle(300, 850, 10).attr({
            fill: 'darkred'
        });
    }
    var time = 1000;
    var w = 600;
    var hasBullet = true;
    $(document).on('keydown', function(e) {
        console.log(e.which);
        switch (e.which) {
            case 37: // left
                var x = fighter.attr("cx");
                var t = x / w;
                fighter.stop().animate({
                    cx: 25
                }, t * time);
                break;
            case 39: // right
                var x = fighter.attr("cx");
                var t = (w - x) / w;
                fighter.stop().animate({
                    cx: w - 25
                }, t * time);
                break;
            case 32: // fire
                if (nowbullet.length > 0) {
                    var x = fighter.attr("cx");
                    var bullettime = 2000;
                    var b = nowbullet.pop();
                    nowshotbullet.push(b);
                    b.stop().attr({
                        cx: x,
                        cy: 750
                    }).animate({
                        cy: -10
                    }, bullettime, function() {
                        var idx = nowshotbullet.indexOf(b);
                        nowshotbullet.splice(idx, 1);
                        nowbullet.push(b);
                    });
                }
                break;

            default:
                break;
        }
    });

    setInterval(function() {
        var fighterx = fighter.attr("cx");
        for (var i = 0; i < enimies.length; i++) {
            for (var j = 0; j < nowshotbullet.length; j++) {
                var bullet = nowshotbullet[j];
                var e = enimies[i];
                var enimiesy = e.attr("cy");
                var collision = Snap.path.isBBoxIntersect(e.getBBox(), bullet.getBBox());
                if (collision) {
                    bullet.stop().attr({
                        cx: -50
                    });
                    nowshotbullet.splice(j, 1);
                    nowbullet.push(bullet);
                    enimies.splice(i, 1);
                    e.remove();
                    point++;
                    $("#point").text("The point:" + point);
                    break;
                }
                var collision2 = Snap.path.isBBoxIntersect(e.getBBox(), fighter.getBBox());
                if (collision2) {
                    fighter.remove();
                    bullet.remove();
                    $("#gamestatus").text("Game Over!");
                    console.log("Game Over!");
                    break;
                }
                if (enimiesy == 750) {
                    enimies[i].animate({
                        cx: fighterx
                    }, 1000);
                }
            }
        }
        if (enimies.length === 0) {
            fighter.animate({
                cx: 300,
                cy: 50
            }, 1000);
            nowbullet = [];
            nowshotbullet = [];
            $("#gamestatus").text("You Win!");
            console.log("You Win!");
        }
        for (var i = 0; i < blueenimies.length; i++) {
            for (var j = 0; j < nowshotbullet.length; j++) {
                var bullet = nowshotbullet[j];
                var be = blueenimies[i];
                blueenimies[i].stop().animate({
                    cy: 750,
                    cx: fighterx
                }, 10000);
                var collision3 = Snap.path.isBBoxIntersect(be.getBBox(), bullet.getBBox());
                if (collision3) {
                    fighter.remove();
                    bullet.remove();
                    nowbullet = [];
                    nowshotbullet = [];
                    blueenimies.splice(i, 1);
                    be.remove();
                    $("#gamestatus").text("Game Over!");
                    console.log("Game Over!");
                    break;
                }
                var collision4 = Snap.path.isBBoxIntersect(be.getBBox(), fighter.getBBox());
                if (collision4) {
                    fighter.remove();
                    bullet.remove();
                    nowbullet = [];
                    nowshotbullet = [];
                    blueenimies.splice(i, 1);
                    be.remove();
                    $("#gamestatus").text("Game Over!");
                    console.log("Game Over!");
                    break;
                }
            }
        }
    }, 50);

});
