// Global variables and constants
let model, labelContainer, maxPredictions;
const urlMale = 'https://teachablemachine.withgoogle.com/models/VPKZbMHf0/';
const urlFemale = 'https://teachablemachine.withgoogle.com/models/ICJBPBgbw/';

// Initialize the AI model
async function init() {
    const isMale = document.getElementById('gender').checked;
    const URL = isMale ? urlMale : urlFemale;
    
    const modelURL = URL + 'model.json';
    const metadataURL = URL + 'metadata.json';
    
    try {
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        
        labelContainer = document.getElementById('label-container');
        labelContainer.innerHTML = ''; // Clear previous labels
        for (let i = 0; i < maxPredictions; i++) {
            const element = document.createElement('div');
            element.classList.add('d-flex', 'mb-2', 'align-items-center');
            labelContainer.appendChild(element);
        }
    } catch (error) {
        console.error('Failed to load model:', error);
    }
}

// Prediction logic
async function predict() {
    const image = document.getElementById('face-image');
    const prediction = await model.predict(image, false);
    prediction.sort((a, b) => parseFloat(b.probability) - parseFloat(a.probability));
    
    const topResult = prediction[0];
    const isMale = document.getElementById('gender').checked;
    
    let resultTitle, resultExplain, resultCeleb;
    
    const resultsData = {
        male: {
            singer: {
                title: '멋있는 가수상',
                explain: '화려한 무대와 빛나는 조명아래 대중들의 쏟아지는 환호와 갈채를 받으며 노래하고 연주하며 춤추는 멋진 가수를 꿈꾸어 보신 적이 있으신가요, 당신의 모습이 가수상으로 나왔다면 멋쟁이 가수로서의 소질을 타고 났을지도 모를 일입니다. 용기를 내어 한번 도전해 보심이 어떨까요!',
                celeb: '셀럽 가수: 방탄소년단, 임영웅, 강다니엘, 백현(엑소)'
            },
            moviestar: {
                title: '매력있는 영화배우상',
                explain: '영화배우상으로 관상이 나온 당신은 영화 로미오와 줄리엣의 주연 배우 레오나르도 디카프리오를 닮은 매력쟁이 인기남 이겠군요. 만인의 연인으로서 만인의 사랑을 받는 당신은 욕심쟁이 이기도 합니다.!',
                celeb: '셀럽 영화배우: 강동원, 마동석, 박보검, 이종석, 이준기'
            },
            entertainer: {
                title: '다재다능 연예인상',
                explain: '당신은 노래, 드라마, 뮤지컬, 연극, 영화, 음악 등 다방면에 다재다능한 연예인상입니다. 당신은 여러 주변 사람들에게 기쁨을 주는 행복바이러스이고 희로애락을 주는 만능 엔터테이너입니다!',
                celeb: '셀럽 연예인: 이승기, 김수현, 유아인, 육성재, 유재석'
            },
            politician: {
                title: '총명한 정치법률가상',
                explain: '두뇌가 총명하고 명석하며 재능도 많아 다양한 영역에서 두각을 나타내는 상입니다. 정치법률가상은 넓은 이마를 가져 사물을 큰 관점에서 보고 얼굴 중앙부와 하부가 발달해 있으면 실행력이 뛰어나며 콧방울이 큰 코를 가졌으면 재산운도 있습니다. 윤곽이 뚜렷한 팔자 눈썹을 가졌다면 당신은 카리스마 넘치는 야심가일 것입니다.',
                celeb: '셀럽 정치법률가: 박지원, 표창원, 박주민, 홍준표, 오바마'
            },
            rich: {
                title: '핸썸한 부자상',
                explain: '눈썹 사이가 넓고 훤하여 인생을 탄탄대로로 성공할 수 있는 상입니다. 코 끝이 둥글고 콧방울이 뚜렷할수록 금전운이 좋습니다. 도톰하고 동글동글한 귓바퀴에 두껍고 살집이 풍만한 귓불을 가진 남자는 활력이 넘치고 건강한 스타일로 재물운이 따르고 명성을 얻어 거물이 될 상입니다.!',
                celeb: '셀럽 부자: 이건희, 빌게이츠, 정몽구, 김택진, 김범수, 김정주'
            }
        },
        female: {
            singer: {
                title: '귀여운 가수상',
                explain: '개성이 강하고 지성과 감성의 균형이 잘 잡혀 있으며 인간관계도 원만합니다. 눈동자가 뚜렷하고 선명하며 적당히 둥글고 가느다란 좋은 눈을 가졌습니다. 턱이 둥그스름 하다면 주변 사람들에게 정을 베푸는 타입으로서 항상 남들한테 즐거움을 주고 대부분 좋은 평을 받는 호감형의 성격입니다. 상냥하고 활발하면서 매사 의욕적이고 활력이 넘치는 생활을 즐기는 타입입니다.!',
                celeb: '셀럽 가수: 이효리, 아이유, 수지, 민아(걸스데이), 나연(트와이스)'
            },
            moviestar: {
                title: '섹시한 영화배우상',
                explain: '매끄러우면서도 홍조가 살짝 나타나는 뽀얀 피부, 우수에 젖은 눈동자, 오똑한 코, 풍성하고 긴 속눈썹을 자랑하고픈 당신은 도도해 보이지만 매우 사교적이고 묘한 매력을 풍겨 누구하고도 잘 어울리며 인기가 넘쳐 주변에 따르는 이들이 많습니다. 섹시함을 뽐내면서도 애교도 부릴줄 아는 귀여움을 지녀 여성들로부터는 부러움을 받고 남성들로부터는 많은 사랑을 받는 매력녀입니다.!',
                celeb: '셀럽 영화배우: 김혜수, 손예진, 송혜교, 박보영, 오드리헵번, 강수연, '
            },
            entertainer: {
                title: '만능 연예인상',
                explain: '때로는 매혹적인 눈빛을 발사하지만 청순하면서도 귀엽고 순수하며 상큼하고 깜직 발랄한 당신은 어느 곳에서나 관심과 사랑을 듬뿍받는 존재입니다. 총명하고 재주가 많아 노래, 연기 등 예능은 물론이고 사업까지 뛰어난 수완을 발휘하고 있으며 사랑을 줄줄 알고 사랑하는 사람의 마음을 사로잡을 줄 아는 능력까지 갖춘 만능 엔터테이너입니다.!',
                celeb: '셀럽 연예인: 김태희, 수지, 한가인, 한예슬, 설현, 문채원'
            },
            politician: {
                title: '지혜의 정치법률가상',
                explain: '긴 눈썹과 맑은 눈을 가진 당신은 지혜와 더불어 사물을 보는 시야가 매우 넓은 혜안을 지니고 있는 인물입니다. 본인의 철학과 소신이 뚜렷하여 강인하며 다소 차가운 인상으로 비쳐지기도 하지만 겉모습이나 풍기는 이미지와는 달리 내면적으로는 매우 부드럽고 온순한 성격의 소유자입니다. 추진력과 지도력이 강하면서도 따뜻한 인간미를 갖추고 있어 만인의 사랑을 받는 지도자상입니다.',
                celeb: '셀럽 정치법률가상: 추미애, 심상정, 강금실, 류호정, 고민정'
            },
            rich: {
                title: '부러운 부자상',
                explain: '이마가 도톰하고 넓으며 인중이 깊고 목이 긴 당신은 눈가의 애교살이 도톰해 웃는 모습도 복스럽습니다. 당신은 둥글고 부드러우면서 두툼한 콧망울의 단정한 코를 가져 보통 사람이 누리지 못할 뛰어난 재물운을 타고 났습니다. 활동적이고 추진력이 강한 성격이지만 보이지 않는 곳에서는 타인에게 정을 베풀며 나누는 온정과 따스함을 지닌 진정한 부자의 상입니다.',
                celeb: '셀럽 부자: 이부진, 이서현, 홍라희, 서민정, 현정은'
            }
        }
    };

    const data = isMale ? resultsData.male : resultsData.female;
    const result = data[topResult.className] || { title: '알수없음', explain: '', celeb: '' };

    const titleHTML = `<div class="${topResult.className}-animal-title result-title">${result.title}</div>`;
    const explainHTML = `<div class="animal-explain pt-2 result-explain">${result.explain}</div>`;
    const celebHTML = `<div class="${topResult.className}-animal-celeb pt-2 pb-2 result-celeb">${result.celeb}</div>`;
    
    document.querySelector('.result-message').innerHTML = titleHTML + explainHTML + celebHTML;

    for (let i = 0; i < maxPredictions; i++) {
        let barWidth;
        const prob = prediction[i].probability.toFixed(2);
        if (prob > 0.1) {
            barWidth = Math.round(prob * 100) + '%';
        } else if (prob >= 0.01) {
            barWidth = '4%';
        } else {
            barWidth = '2%';
        }

        let labelTitle;
        switch (prediction[i].className) {
            case 'singer': labelTitle = '가수상'; break;
            case 'moviestar': labelTitle = '영화배우상'; break;
            case 'entertainer': labelTitle = '연예인상'; break;
            case 'politician': labelTitle = '정치법률가상'; break;
            case 'rich': labelTitle = '부자상'; break;
            default: labelTitle = '알수없음';
        }

        const labelHTML = `<div class="animal-label d-flex align-items-center">${labelTitle}</div>`;
        const barHTML = `
            <div class="bar-container position-relative container">
                <div class="${prediction[i].className}-box bar-background"></div>
                <div class="d-flex justify-content-center align-items-center ${prediction[i].className}-bar result-bar" style="width: ${barWidth}">
                    <span class="d-block percent-text">${Math.round(prob * 100)}%</span>
                </div>
            </div>`;
        labelContainer.childNodes[i].innerHTML = labelHTML + barHTML;
    }
}

// Event handlers
window.readURL = function(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('.image-upload-wrap').hide();
            $('#loading').show();
            $('.file-upload-image').attr('src', e.target.result);
            $('.file-upload-content').show();
            $('.image-title').html(input.files[0].name);
        };
        reader.readAsDataURL(input.files[0]);
        
        init().then(() => {
            predict().then(() => {
                $('#loading').hide();
            });
        });
    } else {
        removeUpload();
    }
};

window.removeUpload = function() {
    $('.file-upload-input').replaceWith($('.file-upload-input').clone());
    $('.file-upload-content').hide();
    $('.image-upload-wrap').show();
};

window.gaReload = function() {
    if (typeof gtag === 'function') {
        gtag('event', '다른 사진으로 재시도', {
            event_category: '다른 사진으로 재시도',
        });
    }
    window.location.reload();
};

// Initialize listeners
$(document).ready(function() {
    $('.image-upload-wrap').on('dragover', function() {
        $(this).addClass('image-dropping');
    });
    $('.image-upload-wrap').on('dragleave', function() {
        $(this).removeClass('image-dropping');
    });

    // Disqus setup
    (function() {
        const d = document, s = d.createElement('script');
        s.src = 'https://risingsun-1.disqus.com/embed.js';
        s.setAttribute('data-timestamp', +new Date());
        (d.head || d.body).appendChild(s);
    })();
});
