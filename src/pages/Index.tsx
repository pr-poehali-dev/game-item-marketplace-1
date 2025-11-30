import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Product {
  id: number;
  title: string;
  game: string;
  price: number;
  seller: string;
  sellerRating: number;
  image: string;
  description: string;
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все игры');
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatSeller, setChatSeller] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<{text: string, sender: 'user' | 'seller', time: string}[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const categories = ['Все игры', 'CS:GO', 'Dota 2', 'Rust', 'GTA V', 'Minecraft', 'Roblox', 'Standoff 2'];

  const products: Product[] = [
    {
      id: 1,
      title: 'AWP | Dragon Lore (Factory New)',
      game: 'CS:GO',
      price: 45000,
      seller: 'ProGamer123',
      sellerRating: 4.8,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=300&fit=crop',
      description: 'Редкий скин в идеальном состоянии'
    },
    {
      id: 2,
      title: 'Arcana Techies',
      game: 'Dota 2',
      price: 2500,
      seller: 'DotaKing',
      sellerRating: 4.9,
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
      description: 'Эксклюзивная аркана с эффектами'
    },
    {
      id: 3,
      title: 'AK-47 | Fire Serpent',
      game: 'CS:GO',
      price: 12000,
      seller: 'TraderPro',
      sellerRating: 4.7,
      image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=300&fit=crop',
      description: 'Коллекционный скин с минимальным износом'
    },
    {
      id: 4,
      title: 'Набор ресурсов (10000 дерева)',
      game: 'Rust',
      price: 500,
      seller: 'RustMaster',
      sellerRating: 4.6,
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400&h=300&fit=crop',
      description: 'Быстрая доставка ресурсов на сервер'
    },
    {
      id: 5,
      title: 'Robux Premium Pack (10000)',
      game: 'Roblox',
      price: 3500,
      seller: 'RobloxPro',
      sellerRating: 4.9,
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
      description: 'Пополнение Robux на аккаунт за 5 минут'
    },
    {
      id: 6,
      title: 'Golden AK-47 | Пламя',
      game: 'Standoff 2',
      price: 1800,
      seller: 'SO2Trader',
      sellerRating: 4.8,
      image: 'https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?w=400&h=300&fit=crop',
      description: 'Легендарное золотое оружие с эффектом'
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.game.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Все игры' || product.game === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Gamepad2" className="text-white" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-primary">GameMarket</h1>
            </div>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Поиск игровых предметов..."
                  className="pl-10 pr-4 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Icon name="Plus" size={18} />
                    Создать товар
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Создать новый товар</DialogTitle>
                    <DialogDescription>
                      Заполните информацию о товаре для продажи
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="product-title">Название товара</Label>
                      <Input id="product-title" placeholder="Например: AWP | Dragon Lore" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-game">Игра</Label>
                      <Input id="product-game" placeholder="Например: CS:GO" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-price">Цена (₽)</Label>
                      <Input id="product-price" type="number" placeholder="1000" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-description">Описание</Label>
                      <Textarea id="product-description" placeholder="Опишите ваш товар..." rows={4} />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="product-image">Изображение товара</Label>
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Input 
                            id="product-image" 
                            type="file" 
                            accept="image/*"
                            className="cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setImageFile(file);
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setImagePreview(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </div>
                        {imagePreview && (
                          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                            <img 
                              src={imagePreview} 
                              alt="Предпросмотр" 
                              className="w-full h-full object-cover"
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setImagePreview('');
                                setImageFile(null);
                                const input = document.getElementById('product-image') as HTMLInputElement;
                                if (input) input.value = '';
                              }}
                            >
                              <Icon name="X" size={18} />
                            </Button>
                          </div>
                        )}
                        <p className="text-xs text-gray-500">Поддерживаются форматы: JPG, PNG, GIF (макс. 5 МБ)</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddProductOpen(false)}>
                      Отмена
                    </Button>
                    <Button onClick={() => setIsAddProductOpen(false)}>
                      Создать товар
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button className="gap-2">
                <Icon name="User" size={18} />
                Профиль
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Маркетплейс игровых предметов</h2>
          <p className="text-gray-600">Покупайте и продавайте игровые предметы безопасно</p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="PackageX" className="mx-auto mb-4 text-gray-400" size={64} />
            <h3 className="text-xl font-semibold mb-2">Товары не найдены</h3>
            <p className="text-gray-600">Попробуйте изменить параметры поиска</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-white text-primary border border-primary">
                    {product.game}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg line-clamp-2">{product.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-white text-xs">
                        {product.seller.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{product.seller}</p>
                      <div className="flex items-center gap-1">
                        <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-gray-600">{product.sellerRating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {product.price.toLocaleString('ru-RU')} ₽
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex-1 gap-2">
                        <Icon name="CreditCard" size={18} />
                        Купить
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Оплата товара</DialogTitle>
                        <DialogDescription>
                          {product.title}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                          <span className="font-medium">Итого к оплате:</span>
                          <span className="text-2xl font-bold text-primary">
                            {product.price.toLocaleString('ru-RU')} ₽
                          </span>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Номер карты</Label>
                          <Input id="card-number" placeholder="0000 0000 0000 0000" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Срок действия</Label>
                            <Input id="expiry" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="000" type="password" />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          className="w-full gap-2"
                          onClick={() => {
                            setChatSeller(product.seller);
                            setChatMessages([
                              {
                                text: `Здравствуйте! Я купил товар "${product.title}". Как получить покупку?`,
                                sender: 'user',
                                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                              },
                              {
                                text: 'Привет! Спасибо за покупку. Сейчас передам вам товар. Какой ваш игровой ник?',
                                sender: 'seller',
                                time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                              }
                            ]);
                            setIsChatOpen(true);
                          }}
                        >
                          <Icon name="ShieldCheck" size={18} />
                          Оплатить {product.price.toLocaleString('ru-RU')} ₽
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="icon">
                    <Icon name="Heart" size={18} />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Gamepad2" className="text-white" size={20} />
                </div>
                <span className="font-bold text-lg">GameMarket</span>
              </div>
              <p className="text-sm text-gray-600">
                Безопасная платформа для покупки и продажи игровых предметов
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Каталог</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>CS:GO предметы</li>
                <li>Dota 2 предметы</li>
                <li>Rust предметы</li>
                <li>GTA V предметы</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Помощь</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Как купить</li>
                <li>Как продать</li>
                <li>Гарантии</li>
                <li>Поддержка</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Контакты</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  support@gamemarket.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="MessageCircle" size={16} />
                  Онлайн чат
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-6 text-center text-sm text-gray-600">
            © 2024 GameMarket. Все права защищены.
          </div>
        </div>
      </footer>

      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-white">
                  {chatSeller.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle>Чат с {chatSeller}</DialogTitle>
                <DialogDescription>Продавец онлайн</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <span className={`text-xs mt-1 block ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Напишите сообщение..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && messageInput.trim()) {
                    setChatMessages([
                      ...chatMessages,
                      {
                        text: messageInput,
                        sender: 'user',
                        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                    setMessageInput('');
                  }
                }}
              />
              <Button
                onClick={() => {
                  if (messageInput.trim()) {
                    setChatMessages([
                      ...chatMessages,
                      {
                        text: messageInput,
                        sender: 'user',
                        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                      }
                    ]);
                    setMessageInput('');
                  }
                }}
              >
                <Icon name="Send" size={18} />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;